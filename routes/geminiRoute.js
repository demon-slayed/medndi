import express from 'express';
import multer from 'multer';
import path from 'path';
import { analysePDF } from '../gemini/PdfParse.js';
import { v4 as uuidv4 } from 'uuid';
import { requireSignIn } from '../middlewares/authMiddleware.js';


const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       const uploadDir = path.join(__dirname, 'uploads');
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }
//       cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     }
//   });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const random = uuidv4();
      cb(null, random+""+file.originalname);
    }
  })
  
  const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed'));
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });

  router.post('/analyze-pdf', requireSignIn, upload.single('pdfFile'), analysePDF)

export default router