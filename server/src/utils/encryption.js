// server/src/utils/encryption.js
const crypto = require('crypto');

// AES-256-GCM encryption/decryption
class AES256GCM {
  static encrypt(text, key) {
    // Generate random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    // Encrypt
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  static decrypt(encrypted, key, iv, authTag) {
    // Convert hex strings to buffers
    const ivBuffer = Buffer.from(iv, 'hex');
    const authTagBuffer = Buffer.from(authTag, 'hex');
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
    decipher.setAuthTag(authTagBuffer);
    
    // Decrypt
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  static generateKey() {
    return crypto.randomBytes(32); // 256 bits
  }
}

// RSA encryption/decryption (for key exchange)
class RSA {
  static encrypt(text, publicKey) {
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  }
  
  static decrypt(encrypted, privateKey) {
    const buffer = Buffer.from(encrypted, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
  }
  
  static generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
  }
}

// Hybrid encryption (combine AES and RSA)
class HybridEncryption {
  /**
   * Encrypt message using hybrid encryption
   * @param {string} message - Plain text message
   * @param {string} receiverPublicKey - Receiver's RSA public key
   * @returns {object} Encrypted data
   */
  static encryptMessage(message, receiverPublicKey) {
    // Generate random AES key
    const aesKey = AES256GCM.generateKey();
    
    // Encrypt message with AES
    const aesEncrypted = AES256GCM.encrypt(message, aesKey);
    
    // Encrypt AES key with receiver's public key
    const encryptedKey = RSA.encrypt(aesKey.toString('hex'), receiverPublicKey);
    
    return {
      encryptedContent: aesEncrypted.encrypted,
      iv: aesEncrypted.iv,
      authTag: aesEncrypted.authTag,
      encryptedKey: encryptedKey,
      encryptionVersion: 'AES-256-GCM + RSA-2048'
    };
  }
  
  /**
   * Decrypt message using hybrid encryption
   * @param {object} encryptedData - Encrypted data object
   * @param {string} privateKey - Receiver's RSA private key
   * @returns {string} Decrypted message
   */
  static decryptMessage(encryptedData, privateKey) {
    // Decrypt AES key with private key
    const aesKeyHex = RSA.decrypt(encryptedData.encryptedKey, privateKey);
    const aesKey = Buffer.from(aesKeyHex, 'hex');
    
    // Decrypt message with AES key
    return AES256GCM.decrypt(
      encryptedData.encryptedContent,
      aesKey,
      encryptedData.iv,
      encryptedData.authTag
    );
  }
}

// Message signing and verification
class MessageSigner {
  static sign(message, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    return sign.sign(privateKey, 'hex');
  }
  
  static verify(message, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
  }
}

// Password hashing
class PasswordHasher {
  static async hash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }
  
  static async verify(password, hashedPassword) {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  }
}

// Generate secure random tokens
const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

// Generate message hash for deduplication
const generateMessageHash = (senderId, receiverId, content, timestamp) => {
  const data = `${senderId}${receiverId}${content}${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  AES256GCM,
  RSA,
  HybridEncryption,
  MessageSigner,
  PasswordHasher,
  generateToken,
  generateMessageHash
};
