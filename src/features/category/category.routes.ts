import { Router } from "express";
import { getAllcategory, getcategory, createCategory, renameCategory, deleteCategory } from './categories.controller';
const categoryRouter=Router()

categoryRouter.get("/:slug",getcategory)

categoryRouter.get("/",getAllcategory)

categoryRouter.post("/", createCategory);

categoryRouter.patch("/:slug", renameCategory);

categoryRouter.delete("/:slug", deleteCategory)

export {categoryRouter}