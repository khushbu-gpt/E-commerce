import express from 'express';
import {upload} from '../../middlewares/uploader';
import { uploadImage } from './uploadImage.controller';
const uploadRouter = express.Router();

uploadRouter.post('/upload', upload.single('image'), uploadImage);

export {uploadRouter};
