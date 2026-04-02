import express from 'express';
import { upload } from '../controller/upload_controller.js';
import multer from 'multer';
import { analyze } from '../controller/analyzeController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.post('/upload', multerUpload.single('file'), upload);
router.post(
  '/analyze',
  (req, res, next) => {
    console.log('analyze route hit');
    next();
  },
  analyze,
);

export default router;
