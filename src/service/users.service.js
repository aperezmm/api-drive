const {db}=require('../config/firebase');

module.exports= class UserService{
    constructor(){
        this.database=db.collection('usuarios');
    }

    async getUsers(){
        const data = await this.database.get();
        const users=data.docs.map(user=>({id:user.id, ...user.data()}));
        return users;
    }

    async create(data){
        await this.databse.add(data);
    }

    async getUserByDni(dni){
        const user=await this.database.where('dni','==', dni).get()
        return user.docs[0];
    }

    async getUserById(id){
        const user= await this.database.doc(id).get();
        return user.data();
    }

    async updateUser(id,data){
        await this.database.doc(id).update(data);
    }

    async deleteUser(id){
        await this.database.doc(id).delete();
    }
}