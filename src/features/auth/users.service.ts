import * as Zod from "@/features/auth/users.validator";
import { userModel } from "./users.model";
import AppError from "@/utils/AppError";
import { hashPassword, verifyPassword } from "@/utils/hashing";
import { generateLoginTokens } from "@/utils/jwt";

export const registerUserService = async (
    payload: Zod.RegisterInputZodType
) => {
    const user = new userModel(payload);
    await user.save();
    const { password: _password, ...restuser } = user.toObject();
    return restuser;
};

export const LoginUserService = async (payload: Zod.LoginInputZodType) => {
    const { email, password } = payload;
    const user = await userModel.findOne({ email }).lean();
    if (!user) throw new AppError("Invalid Email or Password", 401);
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) throw new AppError("Invalid Password", 401);
    const token = generateLoginTokens({
        uid: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    if (!token) throw new AppError("Token Genrated Error", 500);
    const { password: _password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens: token };
};

export const resetPasswordService = async ({ email, newpassword }: Zod.ResetPasswordZodType) => { 
      if(!email|| !newpassword) throw new AppError("Email and new password are required",400)
        const hashpassword=await hashPassword(newpassword)
        const user = await userModel.updateOne(
          { email },
          { $set: { password: hashpassword} }
        );
        if (!user.matchedCount) throw new AppError("User Not Found", 404);
        return { message: "Password reset successfully" };
};

export const updateUserService = async (payload: Zod.UpdateUserZodType) => {
    const { firstname, lastname, phone, dob, email, password } = payload;
   const updatedFields:any={}
   if (firstname) updatedFields.firstname = firstname;
   if (lastname) updatedFields.lastname = lastname;
   if (phone) updatedFields.phone = phone;
   if (dob) updatedFields.dob = dob;
   if (email) updatedFields.email = email;
   if (password) updatedFields.password = password;

   if(Object.keys(updatedFields).length==0){
    throw new AppError("No need to update", 404);
   }
    const updatedUser = await userModel.updateOne({ email },{$set:updatedFields});
  
    if (!updatedUser.matchedCount) throw new AppError("No user updated",404);
    return { updatedUser };
};

