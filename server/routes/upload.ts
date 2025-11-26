import express from 'express'
import upload from '../multerMiddleware'

const router = express.Router()

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: 'No file uploaded or invalid file type' })
  }

  try {
    res.json({
      message: 'Upload successful',
      cloudinaryUrl: req.file.path,
      publicId: req.file.filename,
    })
  } catch (err) {
    console.error('Upload failed:', err)
    res.status(500).send('Upload failed: internal server error')
  }
})

export default router

// import { Router } from 'express'
// const router = Router()
// import dotenv from 'dotenv'
// import { v2 as cloudinary } from 'cloudinary'
// import express from 'express'
// import cors from "cors"
// import Multer from 'multer'

// const router = Router()

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// async function handleUpload(file) {
//   const res = await cloudinary.uploader.upload(file, {
//     resource_type: "auto",
//   });
//   return res;
// }

// const storage = new Multer.memoryStorage();
// const upload = Multer({
//   storage,
// });

// router.use(cors());

// router.post("/upload", upload.single("my_file"), async (req, res) => {
//   try {
//     const b64 = Buffer.from(req.file.buffer).toString("base64");
//     let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//     const cldRes = await handleUpload(dataURI);
//     res.json(cldRes);
//   } catch (error) {
//     console.log(error);
//     res.send({
//       message: error.message,
//     });
//   }
// });
// const port = 6000;
// router.listen(port, () => {
//   console.log(`Server Listening on ${port}`);
// });

// // dotenv.config()

// router.post('/', async (req, res, next) => {
//   //   if (!req.auth?.sub) {
//   //     res.sendStatus(StatusCodes.UNAUTHORIZED)
//   //     return
//   //   }

//   try {
//     // const { file } = req.body

//     // cloudinary.config({
//     //   cloud_name: 'dfjgv0mp6',
//     //   api_key: process.env.CLOUDINARY_API_KEY,
//     //   api_secret: process.env.CLOUDINARY_API_SECRET,
//     //   secure: true,
//     // })

//     const result = await cloudinary.uploader.upload(file)
//     console.log(result.public_id)
//     res.json(result.public_id)
//   } catch (err) {
//     next(err)
//   }
// })

// export default router
