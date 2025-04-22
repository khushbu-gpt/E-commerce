import AppError from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject, z, ZodError } from "zod";

type ZodSchema = {
  body?: AnyZodObject | any;
  query?: AnyZodObject;
  params?: AnyZodObject;
};
export const reqValidatorMiddleware = (schema:ZodSchema ) =>
 (req:Request, res:Response, next:NextFunction) => {
  try {
    if (schema.body) schema.body.parse(req.body);
    if (schema.query) schema.query.parse(req.query);
    if (schema.params) schema.params.parse(req.params);
    next();
  } catch (error) {
    if(error instanceof ZodError){
    const errors = error.issues.map((e:{path:any,message:any}) =>({ 
       field:e.path.join("."),
      message: e.message}))
    const message=errors.map((err: { field: any; message: any; })=>`${err.field}: ${err.message}`).join(", ")
    return next(new AppError(message,400))
    }

    return next(new AppError("Unknown Validation",400))
  }
};

