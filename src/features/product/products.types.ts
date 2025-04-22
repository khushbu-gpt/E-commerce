import { Document, Schema } from "mongoose";

export interface Product extends Document{
 sku:string,
 title:string,
 description?:string,
 images?:string[],
 price:number,
 mrp?:number,
 stock?:number,
 category?:Schema.Types.ObjectId,
 variants:{color:string,url:string}[],
 discount?:number,

}