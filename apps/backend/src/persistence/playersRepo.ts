import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Player } from "../domain/player";
import { generateUuid } from "../domain/uuid";
import { DdbClient } from "./ddbClient";

const TABLE_NAME = "players";

export interface PlayersRepoConfig {
  ddbClient: DdbClient;
}

export const createPlayersRepo = ({ ddbClient }: PlayersRepoConfig) => {
  const persistPlayer = async (name: string): Promise<Player> => {
    const id = generateUuid();

    const newPlayer: Player = {
      id,
      name,
      score: 0,
    };

    const cmd = new PutCommand({
      TableName: TABLE_NAME,
      Item: newPlayer,
    });

    await ddbClient.send(cmd);

    return newPlayer;
  };

  return {
    persistPlayer,
  };
};

export type PlayersRepo = ReturnType<typeof createPlayersRepo>;
