import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { CoinPrice, PriceId } from "../domain/price";
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

  const getPriceById = async (id: PriceId): Promise<CoinPrice | undefined> => {
    const cmd = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id,
      },
    });

    const user = await ddbClient.send(cmd);

    return user.Item as CoinPrice;
  };
  return {
    updatePrice,
    getPriceById,
  };
};
