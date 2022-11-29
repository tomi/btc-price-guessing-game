import { Iso8601Timestamp, Uuid } from "./common";

export type Direction = "up" | "down";

export interface Guess {
  playerId: Uuid;
  direction: Direction;
  priceWhenCreated: number;
  createdAt: Iso8601Timestamp;
}
