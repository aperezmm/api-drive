const express=require('express');
const router = express.Router();
const driveController= require('./../controller/drive.controller');
const multer=require('multer');
const storage =multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload=multer({storage});

router.post('/', upload.single('file'),driveController.uploadFile);
router.get('/',driveController.allFolders);
router.get('/:id',driveController.filesByFolder );
router.get('/file/:id', driveController.viewFile)

module.exports=router;