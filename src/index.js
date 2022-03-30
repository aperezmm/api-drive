const express= require('express');
const cors=require('cors');
const logger= require('morgan');
const driveRoute=require('./routes/route.drive');
require('./config/firebase')


const app= express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/drive', driveRoute)

app.listen(3000,()=>{
    console.log('Server listening on 3000...')
});