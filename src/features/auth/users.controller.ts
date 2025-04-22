import { NextFunction, Request, Response } from "express";
import { userModel } from "./users.model";
import { hashPassword, verifyPassword } from "@/utils/hashing";
import { SendResponse } from "@/utils/SendRespone";
import AppError from "@/utils/AppError";
import { generateLoginTokens } from "@/utils/jwt";

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
    const { firstname, lastname, email, password, phone, dob } = req.body;
    const user = await userModel.create({
      firstname,
      lastname,
      email,
      password,
      phone,
      dob,
    });
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
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).lean();
   
    if (!user) throw new AppError("Invalid Email or Password", 401);

    const isValidPassword = await verifyPassword(password, user.password);
    console.debug("3", isValidPassword);

    if (!isValidPassword) throw new AppError("Invalid Password", 401);

    const token = generateLoginTokens({
      uid: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    if (!token) throw new AppError("Token Genrated Error", 401);
    const { password: _password, ...userWithoutPassword } = user;
    res.cookie("refreshtoken", token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    SendResponse(res, {
      status_code: 200,
      message: "User Login Successfully",
      data: { ...userWithoutPassword, accesToken: token.accessToken },
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
    const { email, password } = req.body;
    const hasedPassword = await hashPassword(password);
    const user = await userModel.updateOne(
      { email },
      { $set: { password: hasedPassword } }
    );
    if (!user.matchedCount) throw new AppError("User Not Found", 404);

    SendResponse(res, {
      status_code: 200,
      message: " Reset Password Successfully",
      data: user,
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
) => {
  try {
    const {
      firstname,
      lastname,
      phone,
      dob,
      new_lastname,
      new_phone,
      new_firstname,
      new_dob,
    } = req.body;
    if (
      !firstname ||
      !phone ||
      !lastname ||
      !dob ||
      !new_firstname ||
      !new_phone ||
      !new_lastname ||
      !new_dob
    ) {
      throw new AppError("All fields  are required.", 400);
    }

    const updatedUser = await userModel.updateMany(
      { firstname, lastname, phone, dob },
      [
        {
          $set: {
            firstname: new_firstname,
            lastnamet: new_lastname,
            phone: new_phone,
            dob: new_dob,
          },
        },
        {},
      ]
    );

    if (!updatedUser.matchedCount) throw new AppError("No user updated", 404);

    console.log(updatedUser);
    SendResponse(res, {
      message: "Users updated successfully",
      data: updatedUser.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
