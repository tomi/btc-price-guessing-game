import "source-map-support/register";
import * as Lambda from "aws-lambda";

import { createPricesApi } from "../apis/pricesApi";
import { createDdbClient } from "../persistence/ddbClient";
import { createPricesRepo } from "../persistence/pricesRepo";
import { createJwtService } from "../domain/jwtService";

const pricesApi = createPricesApi({
  pricesRepo: createPricesRepo({
    ddbClient: createDdbClient(),
  }),
  jwtService: createJwtService({
    secret: process.env.JWT_SIGNING_KEY ?? "very.secret.much.secrecy.so.enigma",
  }),
});

export async function handler(event: Lambda.APIGatewayProxyEvent, context: Lambda.Context) {
  return pricesApi.handleRequest(
    {
      method: event.httpMethod,
      path: event.path,
      body: event.body,
      // TODO: The type definitions of these don't seem to match. Let's
      // just assume they do
      query: event.queryStringParameters as any,
      headers: event.headers as any,
    },
    event,
    context,
  );
}
