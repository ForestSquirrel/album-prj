const multer = require('multer');
const path = require('path');
const static = ''
// Set storage engine
const storage = multer.diskStorage({
  destination: '../public/uploads',
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 100MB limit
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('file'); // 'photo' is the name of the field in the form

// Check file type
function checkFileType(file, cb){
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = upload;