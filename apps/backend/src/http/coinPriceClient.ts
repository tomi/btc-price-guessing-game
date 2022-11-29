import fetch from "node-fetch";
import { getCurrentTimestamp } from "../domain/common";

export interface CointPriceClientConfig {
  apiKey: string;
}

export const createCoinPriceClient = ({ apiKey }: CointPriceClientConfig) => {
  const fetchBtcUsdPrice = async () => {
    const response = await fetch(
      `https://coingecko.p.rapidapi.com/simple/price?ids=bitcoin&vs_currencies=usd`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "coingecko.p.rapidapi.com",
        },
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Invalid ${response.status} response from BTC price API: ${body}`);
    }

    const body = (await response.json()) as PriceResponse;

    return {
      updatedAt: getCurrentTimestamp(),
      value: body.bitcoin.usd,
    };
  };

  return {
    fetchBtcUsdPrice,
  };
};

interface PriceResponse {
  bitcoin: {
    usd: number;
  };
}
