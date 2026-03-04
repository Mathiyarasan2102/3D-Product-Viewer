import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadModel, saveSettings, getSettings } from '../controllers/apiController.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /glb|gltf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Only GLB and GLTF files are allowed!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/upload', upload.single('model'), uploadModel);
router.post('/settings', saveSettings);
router.get('/settings', getSettings);

export default router;
