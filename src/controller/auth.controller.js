require('dotenv').config();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Service=require('./../service/users.service');
const UserService=new Service();// Es el servicio que se encarga de hacer las peticiones a firebase

/**
 * 
 * @Body {
 * {
    "dni":"",
    "password":""
}} req 
  En este método es el encargado de hacer loginn y mandar el token que se utilizará para la autenticación de los usuarios. El token contiene el id del usuario, para hacer la busqueda del usuario a la hora de hacer la autenticación.
 * @returns res  Devuelve como respuesta el token de acceso, el id y el dni del usuario, además de un mensaje que dice login successful.
 * Método POST http://localhost:3000/auth/login
 */
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
        res.status(200).send({message:'login successful',access_token:token, user_id:id, user_dni:user.dni});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});
    }
}