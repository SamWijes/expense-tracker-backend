const multer = require('multer');
const pool = require('../db/db');
const path = require('path');


/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getImage(req,res) {
    const id=req.body.id
    const dbquery=await pool.query("SELECT receipt FROM expenses WHERE id=?",[id])
    console.log(dbquery);
    

    
}   


const upload_dir=path.join(process.cwd(),"uploads")

const upload=multer({
    storage:multer.diskStorage({
        destination:"uploads",
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
        }
    }),

})
const singleUploadMW=upload.single('image');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const uploadImage = (req, res) => {
    try {
        req.file
        res.status(200).send("successfully Uploaded Image")
    } catch (error) {
        
    }
  
}
 

module.exports={
    getImage,
    uploadImage,
    singleUploadMW
}