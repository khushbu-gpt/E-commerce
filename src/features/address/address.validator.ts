import {z} from "zod"

export const AddAddressZodSchema=z.object({
    name: z.string().min(3,"name must be at least 3 letter"),
    phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be between 10 to 15 digits"),
    address1:z.string().min(5,"Address Line1 is Required"),
    address2:z.string().optional(),
    city: z.string().min(2,"City is Required"),
    state:z.string().min(2,"State is Required"),
    zipcode:z.string().min(4,"ZipCode is Required"),
    uid: z.string().regex(/^[a-f\d]{24}$/i, "Invalid User ID"),
})

export const UpdateProductZodSchema=z.object({
    name: z.string().min(3,"name sholud be at least 3 letter").optional(),
    phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be between 10 to 15 digits").optional(),
    address1:z.string().optional(),
    address2:z.string().optional(),
    city: z.string().optional(),
    state:z.string().optional(),
    zipcode:z.string().optional(),
})


const objectIdRegex = /^[a-f\d]{24}$/i;

export const getAddressParamsSchema = z.object({
  uid: z.string().regex(objectIdRegex, "Invalid User Id"),
});

export const getAddressByUidQuerySchema=z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be a positive number"),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 6))
    .refine((val) => val > 0 && val <= 10, "Limit must be between 1 and 10"),
})

export const getAddressByUidParamsSchema=z.object({
    id:z.string().regex(/^[a-f\d]{24}$/i,"Invalid Address Id")
})
export const deleteAddressZodSchema=getAddressByUidParamsSchema     

export const updateAddressByIdSchema=getAddressByUidParamsSchema