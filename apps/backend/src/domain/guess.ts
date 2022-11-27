import { Iso8601Timestamp, Uuid } from "./common";

export enum Direction {
  Up = "up",
  Down = "down",
}

export interface Guess {
  playerId: Uuid;
  direction: Direction;
  priceWhenCreated: number;
  createdAt: Iso8601Timestamp;
}
