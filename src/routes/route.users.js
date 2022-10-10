const express= require('express');
const router = express.Router();
const userController=require('./../controller/user.controller');
const middelware=require('./../middleware/accestoken');

router.post('/',middelware.verifyToken,userController.createUser);
router.get('/', middelware.verifyToken,userController.getAllUser);
router.get('/:id',middelware.verifyToken, userController.getUser);
router.put('/:id',middelware.verifyToken, userController.updateUser);
router.put('/password/:id', middelware.verifyToken,userController.updatePassword);
router.delete('/:id', middelware.verifyToken,userController.deleteUser);

module.exports=router;