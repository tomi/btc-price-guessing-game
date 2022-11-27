import "source-map-support/register";
import * as Lambda from "aws-lambda";

import { createGuessesApi } from "../apis/guessesApi";
import { createDdbClient } from "../persistence/ddbClient";
import { createGuessesRepo } from "../persistence/guessesRepo";
import { createJwtService } from "../domain/jwtService";
import { createPricesRepo } from "../persistence/pricesRepo";

const ddbClient = createDdbClient();

const guessesApi = createGuessesApi({
  guessesRepo: createGuessesRepo({
    ddbClient,
  }),
  pricesRepo: createPricesRepo({
    ddbClient,
  }),
  jwtService: createJwtService({
    secret: process.env.JWT_SIGNING_KEY ?? "very.secret.much.secrecy.so.enigma",
  }),
});

export async function handler(event: Lambda.APIGatewayProxyEvent, context: Lambda.Context) {
  return guessesApi.handleRequest(
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
