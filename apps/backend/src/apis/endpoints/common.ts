import { Handler } from "openapi-backend";

export const defaultHeaders = {
  "content-type": "application/json",
  "access-control-allow-origin": "*", // lazy cors config
};

export const defaultErrorHandlers: Record<string, Handler> = {
  notFound: async () => ({
    statusCode: 404,
    body: JSON.stringify({ err: "not found" }),
    headers: defaultHeaders,
  }),
  validationFail: async (c) => ({
    statusCode: 400,
    body: JSON.stringify({ err: c.validation.errors }),
    headers: defaultHeaders,
  }),
  methodNotAllowed: async () => ({
    statusCode: 405,
    body: JSON.stringify({ err: "method not allowed" }),
    headers: defaultHeaders,
  }),
  notImplemented: async () => ({
    statusCode: 501,
    body: JSON.stringify({ status: 501, err: "No handler registered for operation" }),
    headers: defaultHeaders,
  }),
};
