import { Router } from "express";
import {getCartController, updateCartQuantity }  from    "./cart.controller";

const cartRouter=Router()

cartRouter.get("/:uid",getCartController)
cartRouter.patch('/', updateCartQuantity);


 export {cartRouter}