require('dotenv').config();
const { readFile } = require('node:fs/promises');

const {v4}= require('uuid');



const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');



const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.AWS_ENDPOINT_URL_S3, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadSingleFile(file) {
  const fileName = v4() + "." + file.mimetype.split("/")[1];

  const uploadParams = {
    Bucket: process.env.MY_TIGRIS_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.MY_TIGRIS_BUCKET}.s3.amazonaws.com/${fileName}`;
}


async function uploadMultipleFiles(files) {
  return Promise.all(files.map(uploadSingleFile));
}

module.exports = {
  uploadFile: uploadSingleFile, 
  uploadMultipleFiles
};

// async function uploadToTigris(file) {
//   return Promise.all(
//     file.map(async (file)=>{
//     const fileName = v4()+"."+file.mimetype.split('/')[1];
//       const uploadParams = {

//     Bucket: process.env.MY_TIGRIS_BUCKET,
//     Key: fileName,
//     Body: file.buffer,
//     ContentType: file.mimetype,

    
//   };
//   await s3.send(new PutObjectCommand(uploadParams));

//     })
//   )
  

 

  

  
//   return `https://${process.env.MY_TIGRIS_BUCKET}.s3.amazonaws.com/${fileName}`;
// }

// module.exports = { uploadFile: uploadToTigris };

