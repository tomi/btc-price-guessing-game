import * as Lambda from "aws-lambda";
import OpenAPIBackend from "openapi-backend";

const headers = {
  "content-type": "application/json",
  "access-control-allow-origin": "*", // lazy cors config
};

// create api from definition
const playersApi = new OpenAPIBackend({ definition: "../apiSpecs/playersApi.yaml", quick: true });

// register some handlers
playersApi.register({
  notFound: async (c, event: Lambda.APIGatewayProxyEvent, context: Lambda.Context) => ({
    statusCode: 404,
    body: JSON.stringify({ err: "not found" }),
    headers,
  }),
  validationFail: async (c, event: Lambda.APIGatewayProxyEvent, context: Lambda.Context) => ({
    statusCode: 400,
    body: JSON.stringify({ err: c.validation.errors }),
    headers,
  }),
  methodNotAllowed: async () => ({
    statusCode: 405,
    body: JSON.stringify({ err: "method not allowed" }),
    headers,
  }),
  notImplemented: async () => ({
    statusCode: 501,
    body: JSON.stringify({ status: 501, err: "No handler registered for operation" }),
    headers,
  }),
});

// init api
playersApi.init();

export { playersApi };
