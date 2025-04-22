import express from 'express';
const uploadRouter = express.Router();
import {upload} from '../../middlewares/uploader';
import { uploadImage } from './uploadImage.controller';

uploadRouter.post('/upload', upload.single('image'), uploadImage);

export {uploadRouter};
