import { Response } from "express";

type JSONResponseType = {
  data?: any;
  meta?: any;
  status_code?: number;
  application_code?: number;
  message?: string;
  status?: "success" | "error";
};

function JSONResponse({
  data = null,
  meta = {},
  status_code = 200,
  application_code,
  message = "Operation success!",
  status = "success",
}: JSONResponseType) {
  return {
    data,
    meta,
    status_code,
    application_code: application_code || status_code,
    message,
    status,
  };
}

export function SendResponse(resObj: Response, response: JSONResponseType) {
  const res = JSONResponse(response);
  resObj.status(res.status_code).json(res);
}
