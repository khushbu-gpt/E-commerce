import { Router } from "express";
import {
  addAddressController,
  deleteAddressByID,
  getAddressControllerById,
  getAllAddressController,
  updateAddressController,
} from "./address.controller";
import { reqValidatorMiddleware } from "@/middlewares/validation";
import {
  AddAddressZodSchema,
  deleteAddressZodSchema,
  getAddressByUidParamsSchema,
  getAddressByUidQuerySchema,
  updateAddressByIdSchema,
} from "./address.validator";

const addressRouter = Router();

addressRouter.get(
  "/all/",
  reqValidatorMiddleware({ query: getAddressByUidQuerySchema }),
  getAllAddressController
);
addressRouter.get(
  "/:id",
  reqValidatorMiddleware({ params: getAddressByUidParamsSchema }),
  getAddressControllerById
);
addressRouter.post(
  "/",
  reqValidatorMiddleware({ body: AddAddressZodSchema }),
  addAddressController
);
addressRouter.patch(
  "/:id",
  reqValidatorMiddleware({ params: updateAddressByIdSchema }),
  updateAddressController
);
addressRouter.delete(
  "/:id",
  reqValidatorMiddleware({ params: deleteAddressZodSchema }),
  deleteAddressByID
);

export { addressRouter };
