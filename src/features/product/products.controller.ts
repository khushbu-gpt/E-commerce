import { NextFunction, Request, Response } from "express";
import { productModel } from "./products.model";
import AppError from "@/utils/AppError";
import { SendResponse } from "@/utils/SendRespone";
import { MongooseError } from "mongoose";
import * as ProductService from "./products.services";

import {
  addProductListZodType,
  addProductZodType,
  deleteProductZodType,
  fetchProductListZodType,
  fetchProductZodType,
  updateProductZodType,
} from "@/features/product/products.validator";

export const addProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newproduct = await ProductService.addproductService(req.body);
    console.log(newproduct);
    SendResponse(res, {
      message: "Product added successfully",
      meta: { id: newproduct._id },
      data: newproduct,
      status_code: 201,
    });
  } catch (error: any) {
    let errmsg = "failed to fetch product";
    let statusCode = 500;
    if (error instanceof AppError) {
      errmsg = error.message;
      statusCode = error.statusCode;
    }
    if (error instanceof MongooseError) {
      errmsg = "Duplicate key error: SKU must be unique";
      statusCode = 409;
    }
    return next(new AppError(errmsg, statusCode));
  }
};

export const addProductListController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as addProductListZodType[];
    const ListOfproducts = await productModel.insertMany(data);
    SendResponse(res, {
      message: "Product added successfully",
      data: ListOfproducts,
      status_code: 201,
    });
  } catch (error) {
    const errmsg =
      error instanceof AppError ? error.message : "failed to update product";
    const errcode = error instanceof AppError ? error.statusCode : 500;
    return next(new AppError(errmsg, errcode));
  }
};

export const fetchProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await ProductService.getProductService(
      req.params as fetchProductZodType
    );
    SendResponse(res, {
      message: "product retrieved  successfully",
      data: products,
      status_code: 200,
    });
  } catch (error) {
    const errmsz =
      error instanceof AppError ? error.message : "failed to fetch product";
    const errcode = error instanceof AppError ? error.statusCode : 500;
    next(new AppError(errmsz, errcode));
  }
};

export const fetchProductListController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, page } = req.query as unknown as fetchProductListZodType;
    const products = await ProductService.getProductListService({
      limit,
      page,
    });
    console.log(products);
    SendResponse(res, {
      message: "product retrieved  successfully",
      data: products,
      status_code: 200,
    });
  } catch (error) {
    const errMessage =
      error instanceof AppError ? error.message : "Products fetching failed!";
    const errCode = error instanceof AppError ? error.statusCode : 500;
    return next(new AppError(errMessage, errCode));
  }
};

export const deleteProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedProduct = await ProductService.deleteProductService(
      req.params as deleteProductZodType
    );
    console.log(deletedProduct);
    SendResponse(res, {
      message: "product deleted successfully",
      data: deletedProduct,
      status_code: 200,
    });
  } catch (error) {
    const errmsz =
      error instanceof AppError ? error.message : "failed to delete  product";
    const errcode = error instanceof AppError ? error.statusCode : 500;
    return next(new AppError(errmsz, errcode));
  }
};


export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as updateProductZodType;

   const updatedProduct=await ProductService.updateProductService(body)

    SendResponse(res, {
      message: "Product updated successfully",
      data: updatedProduct,
      status_code: 200,
    });
  } catch (error: any) {
    const errMsg =
      error instanceof AppError ? error.message : "Failed to update product";
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    next(new AppError(errMsg, statusCode));
  }
};
