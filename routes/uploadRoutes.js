

const express = require('express');
const { singleUploadMW, getImage, uploadImage } = require("../controller/uploadController");

const router=express.Router();

router.post('/getReceipt',getImage);
router.post('/uploadImage',singleUploadMW,uploadImage);

module.exports=router;