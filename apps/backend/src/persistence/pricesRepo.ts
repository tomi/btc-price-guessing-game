import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { CoinPrice } from "../domain/price";
import { DdbClient } from "./ddbClient";

const TABLE_NAME = "prices";

export type PricesRepo = ReturnType<typeof createPricesRepo>;

export interface PricesRepoConfig {
  ddbClient: DdbClient;
}

export const createPricesRepo = ({ ddbClient }: PricesRepoConfig) => {
  const updatePrice = async (price: CoinPrice): Promise<void> => {
    const cmd = new PutCommand({
      TableName: TABLE_NAME,
      Item: price,
    });

    await ddbClient.send(cmd);
  };

  return {
    updatePrice,
  };
};
