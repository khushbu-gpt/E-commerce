import { Product } from "@/features/product/products.types";
import { Schema, Types, model } from "mongoose";

export const productSchema=new Schema<Product>({
    title:{type:String,required:[true,"Title is required"]},
    images:{type:[String],default:[]},
    price:{type:Number,
        required:[true,"Price is required"],
        trim:true,
        min:[0,"Price cannot be negative"]
    },
    category:{type:Types.ObjectId,
        ref:"categories",
        // required:[true,"Category is Required"]
    },
    mrp:{type:Number,min:[0,"MRP cannot be negative"]},
    description:{type:String,default:"",trim:true},
    sku:{type:String,
        required:[true,"SKU is required"],
        unique:true,
        trim:true},
    stock:{type:Number,default:20},
    variants:[
     { color:{type:String,required:true},
      url:{type:String,required:true}
     }
    ],
    discount:{
        type:Number,
       min:[0,"Discount cannot be negative"],
       max:[100,"Discount can't exceed 100%"]
    },

},{
    autoIndex:true,
    timestamps:true
}
)
// productSchema.index({sku:1},{unique:true})
// productSchema.index({"variants.color":1})
const productModel=model('Products',productSchema)
export {productModel}