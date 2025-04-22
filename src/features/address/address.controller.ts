import { NextFunction, Request, Response } from "express";
import { addressModel } from "./address.model";
import { SendResponse } from "@/utils/SendRespone";
import AppError from "@/utils/AppError";
import { Types } from "mongoose";
import { userModel } from "../auth/users.model";
import { getAddressByUidQuerySchema } from "./address.validator";

export const getAddressControllerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      throw new AppError("Invalid Address ID", 400);
    const data = await addressModel.findById(id).lean();
    if (!data) throw new AppError("data not found", 404);
    SendResponse(res, {
      data,
      message: "Address fetched successfully",
      status_code: 200,
    });
  } catch (error) {
    next(new AppError("Getting address failed", 500));
  }
};

export const addAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;
    if (!Types.ObjectId.isValid(payload.uid))
      throw next(new AppError("Invalid user Id", 401));
    const user = await userModel.exists({ _id: payload.uid });
    if (!user) return next(new AppError("user  not exist", 404));
    const Address = await addressModel.create(payload);
    SendResponse(res, {
      data: Address,
      message: "Address added successfully",
      status_code: 201,
    });
  } catch (error) {
    console.error(error);
    next(new AppError("address failed", 500));
  }
};

export const getAllAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Math.max(Math.min(Number(req.query.limit) || 6, 10), 1);
    const page = Math.max(Number(req.query.page) || 1, 1);
    // if (!Types.ObjectId.isValid(uid))
    //   throw next(new AppError("Invalid user Id", 401));
    const data = await addressModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    if (!data.length) throw new AppError("Address  not found", 404);

    SendResponse(res, {
      data,
      message: "Address fetched successfully",
      status_code: 200,
    });
  } catch (error) {
    next(new AppError("Getting address failed", 500));
  }
};

export const updateAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payload } = req.body;
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      throw next(new AppError("Invalid Address Id", 401));
    const data = await addressModel
      .findByIdAndUpdate({ id }, { $set: payload }, { new: true })
      .lean();
    if (!data) return next(new AppError("Address not found", 404));
    SendResponse(res, {
      data: data,
      message: "Address updated successfully",
      status_code: 201,
    });
  } catch (error) {
    console.error(error);
    next(new AppError("address failed", 500));
  }
};

export const deleteAddressByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id))
      throw next(new AppError("Invalid Address Id", 401));
    const data = await addressModel.findByIdAndDelete({ id }).lean();
    if (!data) return next(new AppError("Address not found", 404));
    SendResponse(res, {
      data: data,
      message: "Address Deleted successfully",
      status_code: 201,
    });
  } catch (error) {
    console.error(error);
    next(new AppError("address failed", 500));
  }
};
