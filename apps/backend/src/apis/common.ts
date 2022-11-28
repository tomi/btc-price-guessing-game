import { Handler } from "openapi-backend";
import { JwtService } from "../domain/jwtService";

export const corsHeaders = {
  // these should be configured based on the environment
  "Access-Control-Allow-Headers": "content-type,authorization",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "*",
};

export const defaultHeaders = {
  "content-type": "application/json",
  ...corsHeaders,
};

export const create400Response = (err: any) => ({
  statusCode: 400,
  body: JSON.stringify({ err }),
  headers: defaultHeaders,
});

export const create404Response = () => ({
  statusCode: 404,
  body: JSON.stringify({ err: "not found" }),
  headers: defaultHeaders,
});

export const create409Response = (opts: { err: string }) => ({
  statusCode: 409,
  body: JSON.stringify({ opts }),
  headers: defaultHeaders,
});

export const create503Response = (opts: { err: string }) => ({
  statusCode: 503,
  body: JSON.stringify({ opts }),
  headers: defaultHeaders,
});

export const defaultErrorHandlers: Record<string, Handler> = {
  notFound: async () => create404Response(),
  validationFail: async (c) => create400Response(c.validation.errors),
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

export const defaultOptionsRoute: Handler = () => ({
  statusCode: 200,
  body: "",
  headers: corsHeaders,
});

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
