import { Handler } from "openapi-backend";
import { JwtService } from "../domain/jwtService";

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
  unauthorizedHandler: async (c) => {
    console.warn(`Unauthorized request: ${JSON.stringify(c.security)}`);

    return {
      statusCode: 401,
      body: JSON.stringify({ err: "Unauthorized" }),
      headers: defaultHeaders,
    };
  },
};

export const createJwtAuthHandler = (jwtService: JwtService) => {
  const jwtAuthHandler: Handler = async (c) => {
    const authHeader = c.request.headers["authorization"] as string;
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    const token = authHeader.replace("Bearer ", "");
    const verifiedToken = await jwtService.verifyJwt(token);

    if (!verifiedToken.sub) {
      throw new Error("Missing sub claim from JWT token");
    }

    return {
      userId: verifiedToken.sub,
    };
  };

  return jwtAuthHandler;
};
