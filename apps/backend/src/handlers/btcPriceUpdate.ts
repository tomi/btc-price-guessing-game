import "source-map-support/register";
import * as Lambda from "aws-lambda";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { confconf } from "@confconf/confconf";
import { awsSecretsManagerConfig } from "@confconf/aws-secrets-manager";
import { createCoinPriceClient } from "../http/coinPriceClient";
import { createPricesRepo } from "../persistence/pricesRepo";
import { createDdbClient } from "../persistence/ddbClient";

const secretsClient = new SecretsManagerClient({});

type Config = {
  btcApiKey: string;
};

async function loadConfig() {
  // Create the configuration loader
  const configLoader = confconf<Config>({
    schema: {
      type: "object",
      properties: {
        btcApiKey: { type: "string" },
      },
      required: ["btcApiKey"],
    },
    providers: [
      awsSecretsManagerConfig({
        client: secretsClient,
        secretToLoad: {
          secretId: "btcApiKey",
          transform: (val) => ({
            btcApiKey: val,
          }),
        },
      }),
    ],
  });

  return await configLoader.loadAndValidate();
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

  const price = await coinPriceClient.fetchBtcUsdPrice();

  console.info(`Received new price ${price.value}`);

  await priceRepo.updatePrice(price);

  return;
}
