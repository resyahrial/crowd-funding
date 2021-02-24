const multer = require('multer')
const { diskStorage } = multer
const { extname } = require('path')

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
})

const uploadImage = multer({
  storage,
  limits: { fileSize: 3000000 }, // max 3mb
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('image_url');

const checkFileType = (file, cb) => {
  const allowedExt = /jpeg|jpg|png/;
  const extName = allowedExt.test(extname(file.originalname).toLowerCase());
  const mimeType = allowedExt.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  }
  return cb('Error: Images Only !!!');
};

module.exports = uploadImage

