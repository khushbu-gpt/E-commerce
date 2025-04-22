import { model, Schema, Types } from "mongoose";
import {  ICart, ICartItem, ICartpricing } from "./cart.types";
import { productSchema } from "../product/products.model";

export const cartPricingSchema=new Schema<ICartpricing>({
subtotal:{type:Number,required:true},
tax:{type:Number,required:true},
discount:{type:Number,required:true}
},{
  _id:false
})
export const cartItemSchema=new Schema<ICartItem>({
  _id:{
    type:Types.ObjectId,
    ref:"products",
    required:true,
  },
quantity:{type:Number,required:true},
subtotal:{type:Number,required:true},
},{
  autoIndex:true,
  _id:false,
})
cartItemSchema.add(productSchema)

export const cartSchema = new Schema<ICart>({
  _id:{
    type:Types.ObjectId,
    ref:"users",
    required:true,
  },
items:{type:[cartItemSchema],required:true,min:0,default:[]},
total:{type:Number,required:true},
subtotal:{type:Number,required:true},
tax:{type:Number,required:true},
discount:{type:Number,required:true}
},{
  autoIndex:true,
  timestamps:true
}
);

const cartModel = model<ICart>("Cart", cartSchema);

export { cartModel };
