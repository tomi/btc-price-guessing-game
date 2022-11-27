import { Iso8601Timestamp, Uuid } from "./common";

export enum GuessDirection {
  Up = "up",
  Down = "down",
}

export interface Guess {
  playerId: Uuid;
  direction: GuessDirection;
  priceWhenCreated: number;
  createdAt: Iso8601Timestamp;
}
