import { default as mongoose } from "mongoose";

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/firecommerce");
  console.log("MONGOOSE IS CONNECTED");
};

export { connectDB };
