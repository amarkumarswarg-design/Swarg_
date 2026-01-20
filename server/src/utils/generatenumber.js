// server/src/utils/generateNumber.js
/**
 * Generate a unique Swarg number in format: +1(XXX) YYY-ZZZZ
 */

const usedNumbers = new Set();

const generateRandomDigits = (count) => {
  let digits = '';
  for (let i = 0; i < count; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  return digits;
};

const formatSwargNumber = (areaCode, prefix, lineNumber) => {
  return `+1(${areaCode}) ${prefix}-${lineNumber}`;
};

const generateSwargNumber = () => {
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    // Generate components
    const areaCode = generateRandomDigits(3);
    const prefix = generateRandomDigits(3);
    const lineNumber = generateRandomDigits(4);
    
    // Avoid certain patterns
    if (areaCode.startsWith('0') || areaCode.startsWith('1')) continue;
    if (prefix.startsWith('0') || prefix.startsWith('1')) continue;
    
    // Format number
    const swargNumber = formatSwargNumber(areaCode, prefix, lineNumber);
    
    // Check if unique
    if (!usedNumbers.has(swargNumber)) {
      usedNumbers.add(swargNumber);
      return swargNumber;
    }
    
    attempts++;
  }
  
  // Fallback: use timestamp-based number
  const timestamp = Date.now().toString();
  const areaCode = timestamp.slice(-9, -6);
  const prefix = timestamp.slice(-6, -3);
  const lineNumber = timestamp.slice(-4);
  
  const fallbackNumber = formatSwargNumber(areaCode, prefix, lineNumber);
  usedNumbers.add(fallbackNumber);
  
  return fallbackNumber;
};

// Helper to validate Swarg number format
const isValidSwargNumber = (number) => {
  const pattern = /^\+1\(\d{3}\) \d{3}-\d{4}$/;
  return pattern.test(number);
};

// Helper to extract digits from Swarg number
const extractDigits = (number) => {
  if (!isValidSwargNumber(number)) {
    throw new Error('Invalid Swarg number format');
  }
  
  return number.replace(/\D/g, '');
};

// Helper to parse Swarg number
const parseSwargNumber = (number) => {
  if (!isValidSwargNumber(number)) {
    throw new Error('Invalid Swarg number format');
  }
  
  const match = number.match(/^\+1\((\d{3})\) (\d{3})-(\d{4})$/);
  if (!match) {
    throw new Error('Failed to parse Swarg number');
  }
  
  return {
    countryCode: '+1',
    areaCode: match[1],
    prefix: match[2],
    lineNumber: match[3],
    fullNumber: match[1] + match[2] + match[3]
  };
};

module.exports = {
  generateSwargNumber,
  isValidSwargNumber,
  extractDigits,
  parseSwargNumber
};
