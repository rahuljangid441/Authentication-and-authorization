import multer from "multer";
import crypto from 'crypto';
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    crypto.randomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, file.fieldname + '-' + raw.toString('hex') + '.' + ext);
    })
  }
})

const fileFilter = (req,file,cb) => {
    const allowed = ['image/png','image/jpeg','application/pdf'];

    if(allowed.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(new Error("File is not supported"),false);
    }
}
export const upload = multer({
    storage,
    limits:{fileSize:5*1024*1024},
    fileFilter:fileFilter
})