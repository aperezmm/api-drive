const bcryt= require('bcrypt');
const Service=require('./../service/users.service');
const UserService=new Service();

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

exports.getAllUser=async(req, res)=>{
    try {
        const users= await UserService.getUsers();
        return res.status(200).send({message:'all users', users: users})
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Internal server error'});
    }
}

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
