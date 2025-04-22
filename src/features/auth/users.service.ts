// import AppError from "@/utils/AppError";
// import { userModel } from "./users.model";
// import { verifyPassword } from "@/utils/hashing";
// import { generateLoginTokens } from "@/utils/jwt";
// import * as Zod from "@/features/auth/users.validator";
// export const loginUser = async (payload: Zod.LoginInputZodType) => {
//     const user = await userModel.findOne({ email: payload.email }).lean();
//     if (!user) throw new AppError("Invalid email or password", 401);
  
//     const isValid = await verifyPassword(payload.password, user.password);
//     if (!isValid) throw new AppError("Invalid email or password", 401);
  
//     const tokens = await generateLoginTokens({
//       email: user.email,
//       uid: user._id.toString(),
//       role: user.role,
//     });
  
//     await userModel.updateOne(
//       { email: user.email },
//       { $push: { refreshToken: tokens.refreshToken } }
//     );
  
//     const userWithoutPassword = (({ password: _password, ...rest }) => rest)(
//       user
//     );
//     return { tokens, user: userWithoutPassword };
//   };
  