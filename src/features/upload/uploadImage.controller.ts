import { cloudinary } from "../../config/cloudinary";
import fs from "fs";

const uploadImage = async (req, res) => {
  try {
    const localPath = req.file.path;
    const result = await cloudinary.v2.uploader.upload(localPath, {
      folder: "uploads",
    });

    fs.unlinkSync(localPath);

    res.status(200).json({
      success: true,
      message: "Uploaded to Cloudinary!",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export { uploadImage };
