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
const middelware=require('./../middleware/accestoken');

router.post('/', middelware.verifyToken,upload.single('file'),driveController.uploadFile);
router.get('/',middelware.verifyToken,driveController.allFolders);
router.get('/:id',middelware.verifyToken,driveController.filesByFolder );
router.get('/file/:id', middelware.verifyToken,driveController.viewFile);
router.delete('/:id',middelware.verifyToken,driveController.deleteFile);

module.exports=router;