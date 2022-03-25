const fs= require('fs');
const { google} =require('googleapis');

module.exports=class GoogleDrive {
    constructor(clientId, clientSecret, redireactUri, refreshToken){
        this.driveClient= this.createDriveClient(clientId,clientSecret, redireactUri, refreshToken);
    }

    createDriveClient(clientId, clientSecret, redireactUri, refreshToken){
        const client = new google.auth.OAuth2(clientId, clientSecret, redireactUri);
        client.setCredentials({refresh_token: refreshToken});
        return google.drive({
            version:'v3',
            auth:client
        });
    }

    async createFolder(folderName){
        var fileMetadata = {
            "name": folderName,
            "mimeType": 'application/vnd.google-apps.folder'
          };
          const folder= await this.driveClient.files.create({
            resource: fileMetadata,
            fields: 'id, name'
          });
          return folder.data
    }
    async searchFolder(folderName){
      const folder= await this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        });
        return folder.data.files[0];
      }

    async allFolders(){
      const folders= await this.driveClient.files.list({
        q: `mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)',
      });
      return folders.data;
    }
    
    async filesByFolder(folderId){
      const files= await this.driveClient.files.list({
        q:`parents='${folderId}'`,
        fields: 'files(id, name)',
      });
      return files.data;
    }

    saveFile(fileName, filePath, fileMimeType, folderId) {
        return  this.driveClient.files.create({
          requestBody: {
            name: fileName,
            mimeType: fileMimeType,
            parents: folderId ? [folderId] : [],
          },
          media: {
            mimeType: fileMimeType,
            body: fs.createReadStream(filePath),
          },
        });
    }

    async viewFile(fileId){
      await this.driveClient.permissions.create({
        fileId:fileId,
        requestBody:{
          role: 'reader',
          type: 'anyone',
        }
      });
      const file= await this.driveClient.files.get({
        fileId:fileId,
        fields:'webViewLink, webContentLink'
      });

      return file.data;
    }
};