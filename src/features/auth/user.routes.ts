import { Router } from "express";
import {
  getAllUserController,
  loginUserController,
  resetPasswordController,
  updateUserController,
  registerUserController,
} from "./users.controller";
import { registerValidationSchema } from "./users.validator";
import { reqValidatorMiddleware } from "../../middlewares/validation";

const userRouter = Router();
userRouter.get("/", getAllUserController);

userRouter.post(
  "/register",
  reqValidatorMiddleware({ body: registerValidationSchema }),
  registerUserController
);

userRouter.post("/login", loginUserController);

userRouter.patch("/resetPassword", resetPasswordController);

userRouter.patch("/updateUser", updateUserController);
export { userRouter };
