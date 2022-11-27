import "source-map-support/register";
import * as Lambda from "aws-lambda";

import { playersApi } from "../apis/playersApi";

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
