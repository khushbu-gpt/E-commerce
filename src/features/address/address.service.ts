import AppError from "@/utils/AppError";
import { Types } from "mongoose";
import { addressModel } from "./address.model";
import { userModel } from "../auth/users.model";

export const getAddressByIdService = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid Address ID", 400);
  const data = await addressModel.findById(id).lean();
  if (!data) throw new AppError("Address not found", 404);
  return data;
};

export const addAddressService = async (payload: any) => {
  if (!Types.ObjectId.isValid(payload.uid))
    throw new AppError("Invalid user Id", 401);
  const user = await userModel.exists({ _id: payload.uid });
  if (!user) throw new AppError("user  not exist", 404);
  return await addressModel.create(payload);
};

export const deleteAddressService = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid Address Id", 401);
  const data = await addressModel.findByIdAndDelete({ id }).lean();
  if (!data) throw new AppError("Address not found", 404);

  return data
};

export const updateAddressService=async(id:string,payload:any)=>{
        if (!Types.ObjectId.isValid(id))
          throw new AppError("Invalid Address Id", 401);
        const data = await addressModel
          .findByIdAndUpdate({ id }, { $set: payload }, { new: true })
          .lean();
        if (!data) throw new AppError("Address not found", 404);
        return data
}

export const getAllAddressService=async(page:number,limit:number)=>{
    const data = await addressModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    if (!data.length) throw new AppError("Address  not found", 404);
    return data
}