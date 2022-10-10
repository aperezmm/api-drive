const bcryt= require('bcrypt');
const Service=require('./../service/users.service');// Este servicio se encarga de hacer las peticiones a firebase
const UserService=new Service();// Instancia del servico de los usuarios

/**
 * 
 * req @Body {
 *     "dni":"33456",
        "email":"juan@gmail.com",
        "lastnames":"Juan",
        "names":"Pedro",
        "password":"123456"
 * } 
 * @return res retorna un json con un mensaje de user created
 * Este método crea el usuario, además verifica que no se creen usuario con el mismo dni, si esto pasa devuelcve un bad request.
 * Método POST http://localhost:3000/users/
 */
exports.createUser=async(req, res)=>{
    try {
        const data=req.body;
        data.password= await bcryt.hash(data.password,10);
        const userFound=await UserService.getUserByDni(data.dni);
        if(userFound.docs[0]) return res.status(400).send({message:'Already exist one user whit that dni'});
        await UserService.create(data);
        return res.status(201).send({message:'user created'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});
    }
}

/**
 * 
 * @Body {*} req no se le envía nada en el body 
 * @return res responde con un json que contiene un array de todos los usuario que están en la base de datos
 * Todavía  no he hecho algo para cuando no hayan usuarios, porque siempre debe haber uno minimo que sea el admin, para que no nos quedemos sin acceso a la aplicación. 
 * Método GET http://localhost:3000/users/
 */
exports.getAllUser=async(req, res)=>{
    try {
        const users= await UserService.getUsers();
        return res.status(200).send({message:'all users', users: users})
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});
    }
}

/**
 * 
 * req @param {:id}: no es el dni, es el id autogenerado que le da firebase. No se el envia nada en el body.   
 * @return  res: devuelve un json con un mensaje que dice "one user" y los datos del usuario que vas a buscar, si el usuario no está devuelve un 404.
 * Método GET http://localhost:3000/users/:id
 */
exports.getUser=async(req, res)=>{
    try {
        const id=req.params.id;
        const user= await UserService.getUserById(id); 
        if(!user) return res.status(404).send({message:'user doesnt exist'});
        return res.status(200).send({message:'One user', user: user});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});    
    }
}
/**
 * 
 * @param {:id} req 
 * @Body {
 *  "dni":"33456",
    "email":"juan@gmail.com",
    "lastnames":"Juan",
    "names":"Pedro",
 * } req
    Este método realiza la actualización de la información de un usuario, por la url se le manda el id del usuario. Verifica si el usuario exista, si no existe devuelve un 404. No se le pasa la password porque hay que encriptarla.
 * @returns  res devuelve un json con un mensaje de user updated o user doesnt exist
 * Método PUT http://localhost:3000/users/:id
 */
exports.updateUser=async(req, res)=>{
    try {
        const id=req.params.id;
        const data=req.body;
        const user= await UserService.getUserById(id); 
        if(!user) return res.status(404).send({message:'user doesnt exist'});
        await UserService.updateUser(id, data);
        return res.status(200).send({message: 'user updated'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});    
    }
}

/**
 * 
 * @param {:id} req
 * @Body{"password":"admin1234"} req 
 * Este método  encripta la password de un usuario y la actualiza, verifica que el usuario exista, sino existe devuelve un 404.
 * @returns res  devuelve un mensaje que dice password updated o user doesnt exist
 * Método PUT http://localhost:3000/users/:id
 */
exports.updatePassword=async(req, res)=>{
    try {
        const id=req.params.id;
        const data=req.body;
        data.password=await bcryt.hash(data.password,10);
        const user= await UserService.getUserById(id); 
        if(!user) return res.status(404).send({message:'user doesnt exist'});
        await UserService.updateUser(id, data);
        return res.status(200).send({message: 'password updated'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});    
    } 
}

/**
 * 
 * @param {:id} req 
 * Este método elimina un usuario, antes de eliminarlo verifica si el usuario existe, sino existe devuelve un 404.
 * Método DELETE http://localhost:3000/users/:id
 */
exports.deleteUser=async(req, res)=>{
    try {
        const id=req.params.id;
        const user= await UserService.getUserById(id); 
        if(!user) return res.status(404).send({message:'user doesnt exist'});
        await UserService.deleteUser(id);
        return res.status(200).send({message: 'user deleted'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});    
    }
}
