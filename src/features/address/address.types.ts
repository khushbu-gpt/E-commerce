import { ObjectId } from "mongoose"

export interface IBaseAddress{
    name:string;
    phone:string;
    address1:string;
    address2?:string;
    city: string;
    state: string;
    zipcode:string;
}

export interface IAddress extends IBaseAddress{
    uid:ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}