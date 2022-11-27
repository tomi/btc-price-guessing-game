import { Uuid } from "./common";

export type PlayerId = Uuid;

export interface Player {
  id: PlayerId;
  name: string;
  score: number;
}
