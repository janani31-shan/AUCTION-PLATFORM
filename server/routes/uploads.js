const express = require("express");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();
const multer = require("multer");
const isAuth = require("../middlewares/isAuth");
const { uploadFile, getFileStream } = require("../utils/s3");

const upload = multer({ dest: "uploads" });

// @route   POST /upload/image
// @desc    Upload product images
// @access  protected

router.post("/image", isAuth, upload.single("image"), async (req, res) => {
  const file = req.file;
  try {
    console.log("[INFO] req.file", req.file);
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    res.status(200).json({ imagePath: result.Key });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: { msg: "Server error" } });
  }
});

// @route   GET /upload/image/:key
// @desc    Get image with key
// @access  protected
// router.get('/image/:key', async (req, res) => {
//   try {
//     console.log("[INFO] req.params.key", req.params);
//     const fileBuffer = await getFileStream(req.params.key);

//     res.status(200).send(fileBuffer);
//     fileBuffer.pipe(res);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ errors: { msg: 'Server error' } });
//   }
// });

router.get("/image/:key", async (req, res) => {
  try {
    const fileStream = await getFileStream(req.params.key);

    fileStream.on("error", (error) => {
      console.error("Error retrieving file stream:", error);
      res.status(500).json({ errors: { msg: "Error retrieving file" } });
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ errors: { msg: "Server error" } });
  }
});

// router.get("/image/:key", async (req, res) => {
//   try {
//     const fileStream = await getFileStream(req.params.key);

//     const buffers = [];

//     fileStream.on("data", (chunk) => {
//       buffers.push(chunk);
//     });

//     fileStream.on("end", () => {
//       const fileBuffer = Buffer.concat(buffers);
//       res.set("Content-Type", "image/jpeg/png"); // Set the appropriate content type
//       res.send(fileBuffer);
//     });

//     fileStream.on("error", (error) => {
//       console.error("Error retrieving file stream:", error);
//       res.status(500).json({ errors: { msg: "Error retrieving file" } });
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ errors: { msg: "Server error" } });
//   }
// });

module.exports = router;
