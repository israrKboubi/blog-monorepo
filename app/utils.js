
const config = require('./config');
const multer = config.multer;
const path = config.path;
const fs = config.fs;
var crypto = config.crypto;


//function validation for admin
function generateRandomString() {
  const randomBytes = crypto.randomBytes(20);
  const randomString = randomBytes.toString('hex');
  return randomString;
}

//upload files manager
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


module.exports={
  generateRandomString:generateRandomString,
  upload:upload
}