import "dotenv/config";
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db";
import {productRouter} from "./features/product/product.routes";
import {userRouter} from "./features/auth/user.routes";
import {categoryRouter} from "./features/category/category.routes";
import {cartRouter} from "./features/cart/cart.routes";
import { uploadRouter } from "./features/upload/upload.routes";
import { addressRouter } from "./features/address/address.routes";


const app = express();
const PORT = 5000;
// console.log(process.env.SECRET)
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/cart", cartRouter);
app.use("/upload", uploadRouter);
app.use("/address",addressRouter)
app.get("/", (_, res) => {
  res.send({
    msz: "welcome to the home page",
  });
});

try {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING AT ${PORT}`);
      });
    })
    .catch((err:Error) => {
      console.error("DB connection error", err);
    });
} catch (err) {
  console.log((err as Error).message);
}
