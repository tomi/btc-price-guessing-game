import * as Lambda from "aws-lambda";
import * as OpenApi from "openapi-backend";

export type OpenApiApiGatewayProxyEventHandler = (
  c: OpenApi.Context,
  event: Lambda.APIGatewayProxyEvent,
  lambdaContext: Lambda.Context
) => Promise<Lambda.APIGatewayProxyResult>;
