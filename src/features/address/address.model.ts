import { Document, model, Schema, Types } from "mongoose";
import { IAddress, IBaseAddress } from "./address.types";

export const addressBaseSchema=new Schema<IBaseAddress>({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
},{
 
}
)

export const addressSchema=new Schema<IAddress & Document>({
   uid:{
    type: Types.ObjectId,
    required: true,
    ref: "users",
   }
},{
    timestamps:true
})

addressSchema.add(addressBaseSchema)

const addressModel= model<IAddress>("Address",addressSchema)

export {addressModel}