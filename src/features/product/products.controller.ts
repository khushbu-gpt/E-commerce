import { NextFunction, Request, Response } from "express";
import { productModel } from "./products.model";
import AppError from "@/utils/AppError";
import { SendResponse } from "@/utils/SendRespone";
import { MongooseError } from "mongoose";
import {
  addProductListZodType,
  addProductZodType,
  deleteProductZodType,
  fetchProductListZodType,
  updateProductZodType,
} from "@/features/product/products.validator";

export const addProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, price, mrp, description, sku, images, variants } =
      req.body as addProductZodType;
    const newproduct = await productModel.create({
      title,
      price,
      mrp,
      description,
      sku,
      images,
      variants,
    });
    SendResponse(res, {
      message: "Product added successfully",
      meta: { id: newproduct.sku },
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
    const { sku } = req.params;
    const products = await productModel.findOne({ sku }).lean();
    if (!products) throw new AppError("product not found!", 404);
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
    const products = req.query as unknown as fetchProductListZodType;
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    const skip = (page - 1) * limit;
    const AllProduct = await productModel
      .find({})
      .select({
        sku: true,
        title: true,
        price: true,
        stock: true,
        images: true,
      })
      .limit(limit)
      .skip(skip)
      .lean();
    SendResponse(res, {
      message: "product retrieved  successfully",
      data: AllProduct,
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
    const { sku } = req.params as deleteProductZodType;
    const deletedProduct = await productModel.deleteOne({ sku });
    if (!deletedProduct.deletedCount) {
      return next(new AppError("product not found", 404));
    }
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

export const validateVariantsToAdd = (
  existingVariants: { color: string; url: string }[],
  newVariants: { color: string; url: string }[]
) => {
  const existingColors = new Set(existingVariants.map((v) => v.color));
  return existingVariants.length
    ? newVariants
        .filter((v) => v.color?.trim() && v.url?.trim())
        .filter((v) => !existingColors.has(v.color))
    : newVariants;
};

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as updateProductZodType;

    const {
      title,
      category,
      price,
      mrp,
      description,
      rating,
      stock,
      addImages,
      removeImages,
      addVariants,
      removeVariants,
      updateImageOfVariant,
      sku,
    } = body;

    const product = await productModel
      .findOne({ sku })
      .select({ variants: 1, _id: 0 })
      .lean();

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // Validate new variants to be added
    const validVariantsToAdd = validateVariantsToAdd(
      product.variants || [],
      addVariants || []
    );

    // Start building MongoDB update query
    const updateQuery: any = {
      $set: {
        ...(title && { title }),
        ...(category && { category }),
        ...(price && { price }),
        ...(mrp && { mrp }),
        ...(description && { description }),
        ...(rating && { rating }),
      },
    };

    if (stock) {
      updateQuery.$inc = { stock };
    }

    if (addImages?.length) {
      updateQuery.$addToSet = {
        ...(updateQuery.$addToSet || {}),
        images: { $each: addImages },
      };
    }

    if (removeImages?.length) {
      updateQuery.$pull = {
        ...(updateQuery.$pull || {}),
        images: { $in: removeImages },
      };
    }

    if (removeVariants?.length) {
      updateQuery.$pull = {
        ...(updateQuery.$pull || {}),
        variants: { color: { $in: removeVariants } },
      };
    }

    if (validVariantsToAdd?.length) {
      updateQuery.$addToSet = {
        ...(updateQuery.$addToSet || {}),
        variants: { $each: validVariantsToAdd },
      };
    }

    if (updateImageOfVariant) {
      updateQuery.$set["variants.$[elem].url"] = updateImageOfVariant.url;
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { sku },
      updateQuery,
      {
        new: true,
        arrayFilters: updateImageOfVariant
          ? [{ "elem.color": updateImageOfVariant.color }]
          : [],
      }
    );

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
