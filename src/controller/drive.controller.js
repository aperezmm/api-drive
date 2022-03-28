require('dotenv').config();
const CLIENT_ID=process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET=process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI=process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN=process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const DRIVE= require('./../service/google.drive');
const GoogleDriveService= new DRIVE(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN);
const fs=require('fs');
const path=require('path');

/**
 * 
 * @param {folder, file} req 
 * @param {*} res 
 * Este metodo carga un aarchivo nuevo en el drive
 * recibe dos parametros de formulario uno llamado file que es donde viene el archvio y otro llamado folder,
 * que lleva el nombre de la carpeta.
 * @returns 
 * Retorn un mensaje cque dice : file uploaded successful
 */
 exports.uploadFile= async(req, res)=>{
  try {
    const{mimetype, originalname}=req.file;
    const filePath=path.resolve(__dirname,`../../public/${originalname}`);
    const {folder}=req.body;
    let folderExist = await GoogleDriveService.searchFolder(folder)
    if (!folderExist) {
      folderExist = await GoogleDriveService.createFolder(folder);
    }  
    await GoogleDriveService.saveFile(originalname, filePath, mimetype, folderExist.id);
    fs.unlinkSync(filePath);
    return res.send({message:'file uploaded successful'});
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({message:'Internal server error'});
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * No tiene parametros
 * Este metodo devuelve el nombe de las carpetas que hay en el drive con su respectivo id y nombre.
 * @returns 
 */
exports.allFolders= async(req,res)=>{
  try {
    const folders= await GoogleDriveService.allFolders();
    if(!folders) return send.status(404).send({message:`No hay carpetas`});
    return res.send({message:'ok', folder:folders});
  } catch (error) {
    return res.status(500).send({message:'Internal server error'});
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * Este método devuelve los archivos que hay en una carpeta, recibe por parametro de la url,
 * el id de la carpeta de las que se van a buscar los archivos.
 * @returns 
 */
exports.filesByFolder= async(req, res)=>{
  try {
    const{id}=req.params;
    const files= await GoogleDriveService.filesByFolder(id);
    if(!files) return send.status(404).send({message:`No hay archivos en esta carpeta`});
    return res.send({message:'ok', files:files});
  } catch (error) {
    return res.status(500).send({message:'Internal server error'});
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * Este metodo devuelve el link de descarga de un archivo o el link para verlo. 
 * Recibe por parametro de la url el id del archivo que se quiere visualizar.
 * @returns 
 */
exports.viewFile=async(req,res)=>{
  try {
    const{id}=req.params;
    const file=await GoogleDriveService.viewFile(id);
    if(!file) return send.status(404).send({message:`No se encontró el archivo`});
    return res.send({message:'ok', file:file})
  } catch (error) {
    return res.status(500).send({message:'Internal server error'});
  }
}

exports.deleteFile= async(req, res)=>{
  try {
    const{id}=req.params;
    await GoogleDriveService.deleteFile(id);
    return res.send({message:'file deleted',})
  } catch (error) {
    return res.status(500).send({message:'Internal server error'});
  }
}