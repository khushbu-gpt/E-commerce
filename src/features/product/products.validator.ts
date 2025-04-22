import {z} from 'zod';

const addProductSchema = {
  title: z.string().min(1, "Title is required."),
  category: z.string().min(1, "Category is required.").optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive."),
  mrp: z.number().positive("MRP must be positive.").optional(),
  stock: z.number().min(0, "Stock must be at least 0.").optional(),
};

const sku = z.string().min(1, "SKU is required.");
const images=z.array(z.string().url()).optional()
const rating = z.number().min(0).max(5).optional();
const limit = z.coerce.number()
  .min(1, "limit can not be less than 1.")
  .max(20, "limit can not be more than 20.")
  .optional();

const variants =z.array(z.object({
  color: z.string().min(1, "Color is required."),
  url: z.string().url("Must be a valid image URL."),
}));

 export const addProductZodSchema = z.object({
  ...addProductSchema,
  images,
  variants,
  sku,
});

export const updateProductZodSchema=z.object({
  ...addProductSchema,
  rating,
  sku,
  addImages:z.array(z.string().url("Must be a valid Image URL")).optional(),
  removeImages:z.array(z.string().url("Must be valid an Image Url")).optional(),
  addVariants:z.array(variants).optional(),
  removeVariants:z.array(z.string()).optional(),
  updateImageOfVariant:variants.optional()
})

export const fetchProductListZodSchema=z.object({
  page:z.coerce.number().min(1,"page can't be less than 1").optional().default(1),
  limit,
})
  
export const fetchProductZodSchema=z.object({sku})
export const deleteProductZodSchema=fetchProductZodSchema
export const addProductListZodSchema=z.array(addProductZodSchema).min(1,"At least one product should be in the list")


export type fetchProductZodType=z.infer<typeof fetchProductZodSchema>
export type fetchProductListZodType=z.infer<typeof fetchProductListZodSchema>
export type addProductZodType=z.infer<typeof addProductZodSchema>
export type addProductListZodType=z.infer<typeof addProductListZodSchema>
export type updateProductZodType=z.infer<typeof updateProductZodSchema>
export type deleteProductZodType=z.infer<typeof deleteProductZodSchema>


