// server/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirectories = () => {
  const directories = [
    'uploads',
    'uploads/profile',
    'uploads/media',
    'uploads/documents',
    'uploads/temp'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirectories();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/temp';
    
    if (file.fieldname === 'profilePic') {
      uploadPath = 'uploads/profile';
    } else if (file.mimetype.startsWith('image/')) {
      uploadPath = 'uploads/media/images';
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = 'uploads/media/videos';
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath = 'uploads/media/audio';
    } else {
      uploadPath = 'uploads/documents';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
  const allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  const allAllowedTypes = [
    ...allowedImageTypes,
    ...allowedVideoTypes,
    ...allowedAudioTypes,
    ...allowedDocumentTypes
  ];
  
  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 10 // Max 10 files at once
  }
});

// Middleware for single file upload
exports.uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

// Middleware for multiple files upload
exports.uploadMultiple = (fieldName, maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

// Middleware for mixed file types
exports.uploadMixed = (fields) => {
  return upload.fields(fields);
};

// File size validator
exports.validateFileSize = (maxSizeMB) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }
    
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (req.file.size > maxSizeBytes) {
      // Delete uploaded file
      if (req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      
      return res.status(400).json({
        success: false,
        message: `File size exceeds ${maxSizeMB}MB limit`
      });
    }
    
    next();
  };
};

// File type validator
exports.validateFileType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Delete uploaded file
      if (req.file.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'File type not allowed'
      });
    }
    
    next();
  };
};

// Process uploaded file (resize images, generate thumbnails, etc.)
exports.processUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  
  try {
    const file = req.file;
    
    // Add file info to request
    req.fileInfo = {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
      url: `/api/files/${path.basename(file.path)}`
    };
    
    // Generate thumbnail for images
    if (file.mimetype.startsWith('image/')) {
      const sharp = require('sharp');
      const thumbnailPath = file.path.replace(/(\.[\w\d]+)$/, '-thumb$1');
      
      await sharp(file.path)
        .resize(200, 200, { fit: 'inside' })
        .toFile(thumbnailPath);
      
      req.fileInfo.thumbnail = `/api/files/${path.basename(thumbnailPath)}`;
    }
    
    next();
  } catch (error) {
    // Delete uploaded file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    next(error);
  }
};

// Cleanup temp files middleware
exports.cleanupTempFiles = (req, res, next) => {
  // Cleanup temp files after 24 hours
  const tempDir = 'uploads/temp';
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) return;
      
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          
          if (stats.mtimeMs < twentyFourHoursAgo) {
            fs.unlink(filePath, (err) => {
              if (err) console.error('Error deleting temp file:', err);
            });
          }
        });
      });
    });
  }
  
  next();
};
