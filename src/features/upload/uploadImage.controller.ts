import { NextFunction, Request, Response } from "express";
import { cloudinary } from "../../config/cloudinary";
import fs from "fs";
import { SendResponse } from "@/utils/SendRespone";
import AppError from "@/utils/AppError";

const uploadImage = async (req:Request, res:Response,next:NextFunction) => {
  try {
    const localPath = req.file.path;
    const result = await cloudinary.v2.uploader.upload(localPath, {
      folder: "uploads",
    });

    fs.unlinkSync(localPath);

    SendResponse(res,{
      message: "Uploaded to Cloudinary!",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return next(new AppError("cloudinary failed",500))
  }
};

export { uploadImage };
