import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const translateConfig = { marshallOptions };

export type DdbClient = DynamoDBDocumentClient;

export const createDdbClient = (config?: DynamoDBClientConfig) => {
  const client = new DynamoDBClient(
    config ?? {
      endpoint: process.env.DDB_ENDPOINT,
    },
  );
  const ddbClient = DynamoDBDocumentClient.from(client, translateConfig);

  return ddbClient;
};
