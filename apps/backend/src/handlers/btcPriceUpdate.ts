import "source-map-support/register";
import * as Lambda from "aws-lambda";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { awsSecretsManagerConfig } from "@confconf/aws-secrets-manager";
import { createCoinPriceClient } from "../http/coinPriceClient";
import { createPricesRepo } from "../persistence/pricesRepo";
import { createDdbClient } from "../persistence/ddbClient";

const secretsClient = new SecretsManagerClient({});

type Config = {
  btcApiKey: string;
};

async function loadConfig(): Promise<Config> {
  const configLoader = awsSecretsManagerConfig<string>({
    client: secretsClient,
    secretToLoad: {
      secretId: "btcApiKey",
    },
  });

  const btcApiKey = await configLoader.load();
  if (!btcApiKey) {
    throw new Error("Missing btcApiKey secret");
  }

  return {
    btcApiKey,
  };
}

export async function handler(
  event: Lambda.EventBridgeEvent<"ScheduledEvent", any>,
  context: Lambda.Context,
) {
  const config = await loadConfig();
  const coinPriceClient = createCoinPriceClient({
    apiKey: config.btcApiKey,
  });
  const priceRepo = createPricesRepo({
    ddbClient: createDdbClient(),
  });

  const btcUsdPrice = await coinPriceClient.fetchBtcUsdPrice();

  console.info(`Received new price ${btcUsdPrice.value}`);

  await priceRepo.updatePrice({
    id: "BTC-USD",
    ...btcUsdPrice,
  });

  return;
}
