import "source-map-support/register";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import * as Lambda from "aws-lambda";
import { from } from "fromfrom";

import { CoinPrice } from "../domain/price";
import { createDdbClient } from "../persistence/ddbClient";
import { createGuessResolvingRepo } from "../persistence/guessResolvingRepo";
import { resolveGuessesByNewPrice } from "../logic/guessResolving";

const ddbClient = createDdbClient();
const guessResolvingRepo = createGuessResolvingRepo({ ddbClient });

/**
 * Handler to check which guesses can be resolved and resolves them
 * when a new price is available
 */
export async function handler(event: Lambda.DynamoDBStreamEvent, context: Lambda.Context) {
  const newPrice = getNewPrice(event);
  if (!newPrice) return;

  await resolveGuessesByNewPrice({
    guessResolvingRepo,
    newPrice,
  });
}

function getNewPrice(event: Lambda.DynamoDBStreamEvent): CoinPrice | undefined {
  // Take the latest record in case there are multiple
  const ddbRecord = from(event.Records)
    .mapNotNullable((r) => r.dynamodb)
    .sortByDescending((r) => r.ApproximateCreationDateTime)
    .first();

  if (!ddbRecord?.NewImage) return;

  const price = unmarshall(ddbRecord.NewImage as any) as CoinPrice;

  return price;
}
