import { Schema, model } from "mongoose";
import { hashPassword } from "@/utils/hashing";
import AppError from "@/utils/AppError";
import { GENDER, ROLE, UserBase } from "@/features/auth/users.types";

const userSchema = new Schema<UserBase>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    dob: { type: String },
    gender: { type: String, enum: Object.values(GENDER) },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.CLIENT,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  console.log(user);
  try {
    user.password = await hashPassword(user.password);
    next();
  } catch (err) {
    console.error(err);
    next(new AppError("Unexpected Error!", 500));
  }
});

// userSchema.post("findOne", async function (res, next) {
//   console.log({ res });
//   res?.password && delete res?.password;
//   next()
// });

const userModel = model("users", userSchema);
export { userModel };
