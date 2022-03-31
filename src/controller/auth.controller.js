require('dotenv').config();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Service=require('./../service/users.service');
const UserService=new Service();

exports.login=async(req, res)=>{
    try {
        const data=req.body;
        let  id;
        let user= await UserService.getUserByDni(data.dni);
        if(!user) return res.status(404).send({message:'user doesnt exist'});
        id=user.docs[0].id;
        user=user.docs[0].data();
        const isCorrect=await bcrypt.compare(data.password, user.password);
        if(!isCorrect) return res.status(400).send({message:'user o password doesnt match'});
        const token=jwt.sign({id:id},process.env.SECRET_TOKEN, {expiresIn: '1h'});
        res.status(200).send({message:'token',access_token:token, user_id:id, user_dni:user.dni});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});
    }
}