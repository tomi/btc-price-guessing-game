import { Iso8601Timestamp } from "./common";

export type PriceKey = "BTC-USD";

export interface CoinPrice {
  id: PriceKey;
  value: number;
  updatedAt: Iso8601Timestamp;
}
