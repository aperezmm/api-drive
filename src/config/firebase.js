require('dotenv').config();
const path=require('path')
const firebase=path.resolve(__dirname,process.env.GOOGLE_APLICATION_CREDENTIALS);
const admin=require('firebase-admin');
const {initializeApp, applicationDefault}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');

 initializeApp({
    credential:admin.credential.cert(firebase)
}) 

const db=getFirestore();

module.exports={
    db,
}