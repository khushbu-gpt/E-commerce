import { Document, ObjectId } from "mongoose";
import { Product } from "../product/products.types";

export interface ICartpricing {
    subtotal:number;
    tax:number
    discount:number
}

export interface ICartItem extends Document,Product{
    _id:ObjectId
    quantity:number,
    subtotal:number,
    }

export interface ICart extends Document,ICartpricing{
    _id:ObjectId;
     items:ICartItem[];
     total:number;
    }
    