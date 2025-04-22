import { NextFunction, Request, Response } from "express";
import { cartModel } from "./cart.model";
import AppError from "@/utils/AppError";
import { SendResponse } from "@/utils/SendRespone";

export const getCartController = async (req:Request, res:Response,next:NextFunction) => {
  try {
  const _id=req.user?.uid
  if(!_id) return next(new AppError("Unuthorised User!",401))
  const data = await cartModel.findById({_id});
   if (!data) return next(new AppError("product not found",404))
  return SendResponse(res,{ message: "product fetched successfully", 
  data,status_code:200});
  } catch (error) {
   return next(new AppError("cart failed error",500))
  }
};

export const updateCartQuantity = async (req:Request, res:Response,next:NextFunction) => {
  const { product_Id,action="INCREASE" } = req.body;
  const quantity=1
  const _id=req.user?.uid
  if (!product_Id|| _id || !action || quantity) {
    return next(new AppError("All keys are required. product_id, uid, action, quantity!",401))
  }
  
};

