import { Router } from "express";
import {addProductController, addProductListController, deleteProductById, fetchProductController, fetchProductListController, updateProductController } from "./products.controller";
import { reqValidatorMiddleware } from "@/middlewares/validation";
import { addProductListZodSchema, addProductZodSchema, deleteProductZodSchema, fetchProductListZodSchema, fetchProductZodSchema, updateProductZodSchema } from "@/features/product/products.validator";
const productRouter = Router();
productRouter.get("/",reqValidatorMiddleware({query: fetchProductListZodSchema}),fetchProductListController );
productRouter.get("/:sku",reqValidatorMiddleware({params: fetchProductZodSchema,}),fetchProductController);
productRouter.post("/",reqValidatorMiddleware({body:addProductZodSchema}), addProductController);
productRouter.post("/bulk", reqValidatorMiddleware({body:addProductListZodSchema}),addProductListController);
productRouter.patch("/:sku",reqValidatorMiddleware({body:updateProductZodSchema}),updateProductController);
productRouter.delete("/:sku", reqValidatorMiddleware({params: deleteProductZodSchema}),deleteProductById);

export {productRouter};




