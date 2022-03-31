const express= require('express');
const cors=require('cors');
const logger= require('morgan');
const driveRoute=require('./routes/route.drive');
const userRoute=require('./routes/route.users');
const authController=require('./routes/route.auth');


const app= express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/auth', authController);
app.use('/drive', driveRoute)
app.use('/users', userRoute);

app.listen(3000,()=>{
    console.log('Server listening on 3000...')
});