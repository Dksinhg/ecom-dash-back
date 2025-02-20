const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const uniqueId = Date.now();


// exports.uploadTocloudinary = async (file, folder, height, quality)=>{
//   try {
//     const options = {folder};
//     if (height) {
//         options.height = height;
//     }
//     if (quality) {
//         options.quality = quality;
//     }
//     options.resource_type = "auto"

//     return await cloudinary.uploader.upload(file.tempFilePath, options);

//   } catch (error) {
//       console.log("error in cloudinary" , error);
//   }
// }

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    try {
      return {
        folder: 'upload',
        unique_filename: true,
        overwrite:false,
        invalidate:false,
        public_id:`img_${uniqueId}`,
        // format: 'png', // or use file.mimetype.split('/')[1] for dynamic format
        // allowed_formats: ['jpg', 'png'],
        // public_id: 'computed-filename-using-request',
      };
    } catch (error) {
      console.error('Error configuring Cloudinary storage:', error);
      throw new Error('Failed to configure Cloudinary storage');
    }
  },
});

const upload = multer({ storage });

module.exports = upload;

// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Configure storage and other settings as needed
