import AppError from "@/utils/AppError";
import { productModel } from "./products.model";
import * as Zod from "./products.validator";

export const addproductService=async(payload:Zod.addProductZodType)=>{
    const { title,
        price,
        mrp,
        description,
        sku,
        images,
        variants,}=payload
  const newproduct=await productModel.create({
        title,
        price,
        mrp,
        description,
        sku,
        images,
        variants,
      });
return newproduct
}

export const getProductService=async(params:Zod.fetchProductZodType)=>{
const {sku}=params
 const products = await productModel.findOne({ sku }).lean();
if (!products) throw new AppError("product not found!", 404)
 return products
}


export const getProductListService=async(query:Zod.fetchProductListZodType)=>{
      const limit = Number(query.limit);
        const page = Number(query.page);
        const skip = (page - 1) * limit;
       return await productModel
          .find()
          .select({
            sku: true,
            title: true,
            price: true,
            stock: true,
            images: true,
          })
          .limit(limit)
          .skip(skip)
          .lean();
}

export async function deleteProductService(params:Zod.deleteProductZodType) {
    const {sku}=params
    const product = await productModel.findOne({ sku });
    const deletedProduct = await productModel.deleteOne({ sku });
     if (!deletedProduct.deletedCount) {
       throw new AppError("product not found", 404);
     }
     return product
}


export const validateVariantsToAdd = (
  existingVariants: { color: string; url: string }[],
  newVariants: { color: string; url: string }[]
) => {
  const existingColors = new Set(existingVariants.map((v) => v.color));
  return existingVariants.length
    ? newVariants
        .filter((v) => v.color?.trim() && v.url?.trim())
        .filter((v) => !existingColors.has(v.color))
    : newVariants;
};


export const updateProductService=async(body:Zod.updateProductZodType)=>{
   const {
        title,
        category,
        price,
        mrp,
        description,
        rating,
        stock,
        addImages,
        removeImages,
        addVariants,
        removeVariants,
        updateImageOfVariant,
        sku,
      } = body;
  
      const product = await productModel
        .findOne({ sku })
        .select({ variants: 1, _id: 0 })
        .lean();
  
      if (!product) {
         throw new AppError("Product not found", 404);
      }
  
  
      const validVariantsToAdd = validateVariantsToAdd(
        product.variants || [],
        addVariants || []
      );
  
      const updateQuery: any = {
        $set: {
          ...(title && { title }),
          ...(category && { category }),
          ...(price && { price }),
          ...(mrp && { mrp }),
          ...(description && { description }),
          ...(rating && { rating }),
        },
      };
  
      if (stock) {
        updateQuery.$inc = { stock };
      }
  
      if (addImages?.length) {
        updateQuery.$addToSet = {
          ...(updateQuery.$addToSet || {}),
          images: { $each: addImages },
        };
      }
  
      if (removeImages?.length) {
        updateQuery.$pull = {
          ...(updateQuery.$pull || {}),
          images: { $in: removeImages },
        };
      }
  
      if (removeVariants?.length) {
        updateQuery.$pull = {
          ...(updateQuery.$pull || {}),
          variants: { color: { $in: removeVariants } },
        };
      }
  
      if (validVariantsToAdd?.length) {
        updateQuery.$addToSet = {
          ...(updateQuery.$addToSet || {}),
          variants: { $each: validVariantsToAdd },
        };
      }
  
      if (updateImageOfVariant) {
        updateQuery.$set["variants.$[elem].url"] = updateImageOfVariant.url;
      }
  
      const updatedProduct = await productModel.findOneAndUpdate(
        { sku },
        updateQuery,
        {
          new: true,
          arrayFilters: updateImageOfVariant
            ? [{ "elem.color": updateImageOfVariant.color }]
            : [],
        }
      );
      return updatedProduct
}
















