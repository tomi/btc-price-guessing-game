import { Uuid } from "./common";

export interface Player {
  id: Uuid;
  name: string;
  score: number;
}
