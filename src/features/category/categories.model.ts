import { Schema, model } from "mongoose";


const categorySchema=new Schema({
    name:String,
    slug:String,
    description:String,
},{
    // timestamps:true,
})

const categoryModel=model('category',categorySchema)

export {categoryModel};