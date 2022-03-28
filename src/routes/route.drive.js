const express=require('express');
const router = express.Router();
const driveController= require('./../controller/drive.controller');
const multer=require('multer');
const storage =multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'public')
    } ,   
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload=multer({storage});

router.post('/', upload.single('file'),driveController.uploadFile);
router.get('/',driveController.allFolders);
router.get('/:id',driveController.filesByFolder );
router.get('/file/:id', driveController.viewFile);
router.delete('/:id',driveController.deleteFile);

module.exports=router;