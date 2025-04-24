import { NextFunction, Request, Response } from "express";
import { userModel } from "./users.model";
import { SendResponse } from "@/utils/SendRespone";
import AppError from "@/utils/AppError";
import * as userService from "@/features/auth/users.service"
export const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .find({})
      .select({ __v: false, password: false })
      .lean();
    if (!user) throw new AppError("Invalid crendentials", 401);
    SendResponse(res, {
      status_code: 200,
      message: "User Found Successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const registerUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.registerUserService(req.body);
    SendResponse(res, {
      status_code: 201,
      message: "User Registered Successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const loginUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload=req.body
    const {user,tokens}= await userService.LoginUserService(payload);
    res.cookie("refreshtoken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    SendResponse(res, {
      status_code: 200,
      message: "User Login Successfully",
      data: { ...user, accesToken: tokens.accessToken },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newpassword } = req.body;
    const result = await userService.resetPasswordService({email, newpassword});
    SendResponse(res, {
      status_code: 200,
      message: result.message,

    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) =>{
   try{
    const payload=req.body
    const updatedUser=userService.updateUserService(payload)
    SendResponse(res, {
      message: "Users updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
