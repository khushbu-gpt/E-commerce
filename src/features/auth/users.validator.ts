import { z } from "zod";

const string = (name: string) =>
  z.string({
    required_error: `${name} is required`,
    invalid_type_error: `${name} must be a string`,
  });
const email=z.string().email("Invalid Email Format").trim()
const password=z.string().min(6, "Password must be at least 6 characters").max(12).trim()

export const registerValidationSchema = z.object({
  email,password,
  firstname:z.string().min(3, "Minimum 3 characters is required").max(10),
  lastname:z.string().min(3, "Minimum 3 characters is required").max(12),
  phone: string("contact").min(10, "Invalid contact number").max(13),
  dob: string("dob"),
});


export const loginValidationZodSchema=z.object({email,password})
export const resetPasswordZodSchema=z.object({email,password})
export const forgotPasswordZodSchema=z.object({email})
export const verifyForgetPasswordZodSchema=z.object({email,otp:z.string().length(6),new_password:password})


export type RegisterInputZodType=z.infer<typeof registerValidationSchema>
export type LoginInputZodType=z.infer<typeof loginValidationZodSchema>
export type ResetPasswordZodType=z.infer<typeof resetPasswordZodSchema>
export type ForgetPasswordZodType=z.infer<typeof forgotPasswordZodSchema>
export type verifyPasswordZodType=z.infer<typeof verifyForgetPasswordZodSchema>
