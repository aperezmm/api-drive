require('dotenv').config()
const jwt=require('jsonwebtoken');
const Service=require('./../service/users.service');
const UserService=new Service();

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