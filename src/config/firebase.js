/**
 * Está es la configuración para hacer la conexión con firebase.
 */
require('dotenv').config();
const path=require('path')
const firebase=path.resolve(__dirname,process.env.GOOGLE_APLICATION_CREDENTIALS);// Obtenemos la ruta del archivo firebase_config.json
const admin=require('firebase-admin');
const {initializeApp, applicationDefault}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');

/**
 * Establecemos la conexión con firebase
 */
initializeApp({
    credential:admin.credential.cert(firebase)
}) 

// Conexión con firebase para poder guardar datos.
const db=getFirestore();

// Exportamos toda la conexión con firebase para utilizarla en otras partes.
module.exports={
    db,
}