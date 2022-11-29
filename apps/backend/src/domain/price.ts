import { Iso8601Timestamp } from "./common";

// Currently there's only BTC-USD
export type PriceId = "BTC-USD";

export interface CoinPrice {
  id: PriceId;
  value: number;
  updatedAt: Iso8601Timestamp;
}
