import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { getCurrentTimestamp } from "../domain/common";
import { Guess } from "../domain/guess";
import { PlayerId } from "../domain/player";
import { DdbClient } from "./ddbClient";

export const TABLE_NAME = "guesses";

export type GuessesRepo = ReturnType<typeof createGuessesRepo>;

export interface GuessesRepoConfig {
  ddbClient: DdbClient;
}

export const createGuessesRepo = ({ ddbClient }: GuessesRepoConfig) => {
  const createGuess = async (opts: Omit<Guess, "createdAt">): Promise<Guess> => {
    const createdAt = getCurrentTimestamp();

    const guess: Guess = {
      ...opts,
      createdAt,
    };

    const cmd = new PutCommand({
      TableName: TABLE_NAME,
      Item: guess,
    });

    await ddbClient.send(cmd);

    return guess;
  };

  const getGuess = async (playerId: PlayerId): Promise<Guess | undefined> => {
    const cmd = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        playerId,
      },
    });

    const user = await ddbClient.send(cmd);

    return user.Item as Guess;
  };

  return {
    createGuess,
    getGuess,
  };
};
