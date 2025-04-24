import { NextFunction, Request, Response } from "express";
import { SendResponse } from "@/utils/SendRespone";
import AppError from "@/utils/AppError";
import { addAddressService, deleteAddressService, getAddressByIdService, getAllAddressService, updateAddressService } from "./address.service";

export const getAddressControllerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
   const data=await getAddressByIdService(id)
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
    const Address = await addAddressService(req.body)
    SendResponse(res, {
      data: Address,
      message: "Address added successfully",
      status_code: 201,
    });
  } catch (error) {
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
    const data = await getAllAddressService(page,limit)
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
   const data=await updateAddressService(req.params.id,req.body)
    SendResponse(res, {
      data,
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

   const data=await deleteAddressService(req.params.id)
    SendResponse(res, {
      data,
      message: "Address Deleted successfully",
      status_code: 201,
    });
  } catch (error) {
    console.error(error);
    next(new AppError("address failed", 500));
  }
};
