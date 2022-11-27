import "source-map-support/register";
import * as Lambda from "aws-lambda";

import { createPlayersApi } from "../apis/playersApi";
import { createDdbClient } from "../persistence/ddbClient";
import { createPlayersRepo } from "../persistence/playersRepo";
import { createJwtService } from "../domain/jwtService";

const playersApi = createPlayersApi({
  playersRepo: createPlayersRepo({
    ddbClient: createDdbClient(),
  }),
  jwtService: createJwtService({
    secret: process.env.JWT_SIGNING_KEY ?? "very.secret.much.secrecy.so.enigma",
  }),
});

export async function handler(event: Lambda.APIGatewayProxyEvent, context: Lambda.Context) {
  return playersApi.handleRequest(
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
