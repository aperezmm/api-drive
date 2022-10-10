require('dotenv').config()
const jwt=require('jsonwebtoken');
const Service=require('./../service/users.service');// Servicio de usuarios
const UserService=new Service();// instancia del servicio.

/**
 * 
 * Este método se encarga de verificar que el token que viene  el los headers es válido y el usuario puede ser autenticado. De lo contrario no deja seguir la petición.
 * el header se llama Authorization y el contenido es el siguiente Barer Token.
 * @param {*} next Es el encargado de que la petición continue con el método siguiente para satisfacerla
 * 
 */
exports.verifyToken=async (req, res, next)=>{
    try {
        if (!req.headers.authorization) {
			return res.status(401).send({message:'Unauthorized Request'});
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(401).send('Unauthorized Request');
		}
		const contenido = await jwt.verify(token, process.env.SECRET_TOKEN);
        let user=await UserService.getUserById(contenido.id);
        if(!user) return res.status(403).send({message:'Access denied'});
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});
    }
}