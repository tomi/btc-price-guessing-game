import { ScanCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import chunk from "lodash.chunk";

import { Iso8601Timestamp } from "../domain/common";
import { Guess } from "../domain/guess";
import { PlayerId } from "../domain/player";
import { DdbClient } from "./ddbClient";
import { TABLE_NAME as GUESSES_TABLE } from "./guessesRepo";
import { TABLE_NAME as PLAYERS_TABLE } from "./playersRepo";

export type GuessResolvingRepo = ReturnType<typeof createGuessResolvingRepo>;

export interface GuessResolvingConfig {
  ddbClient: DdbClient;
}

export interface ResolveResult {
  playerId: PlayerId;
  pointDelta: 1 | -1;
}

export const createGuessResolvingRepo = ({ ddbClient }: GuessResolvingConfig) => {
  const getGuessesBefore = async (before: Iso8601Timestamp): Promise<Guess[]> => {
    const cmd = new ScanCommand({
      TableName: GUESSES_TABLE,
      FilterExpression: "createdAt < :before",
      ExpressionAttributeValues: {
        ":before": before,
      },
    });

    const output = await ddbClient.send(cmd);

    return (output.Items as Guess[]) ?? [];
  };

  const transactItemsFromResolveResult = (resolveResult: ResolveResult) => {
    return [
      {
        Delete: {
          TableName: GUESSES_TABLE,
          Key: {
            playerId: resolveResult.playerId,
          },
        },
      },
      {
        Update: {
          TableName: PLAYERS_TABLE,
          Key: {
            id: resolveResult.playerId,
          },
          UpdateExpression: "ADD score :delta",
          ExpressionAttributeValues: {
            ":delta": resolveResult.pointDelta,
          },
        },
      },
    ];
  };

  const resolveGuesses = async (resolveResults: ResolveResult[]) => {
    // DynamoDB can handle 100 items in a single TransactWrite command.
    // Each resolve result consists of 2 statements. Hence we chunk
    // the results to buckets of 50.
    const resultChunks = chunk(resolveResults, 50);

    for (const chunk of resultChunks) {
      const cmd = new TransactWriteCommand({
        TransactItems: chunk.flatMap(transactItemsFromResolveResult),
      });

      await ddbClient.send(cmd);
    }
  };

  return {
    getGuessesBefore,
    resolveGuesses,
  };
};
