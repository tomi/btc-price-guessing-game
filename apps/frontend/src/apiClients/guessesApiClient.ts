import { API_BASE_URL } from "../config";

const BASE_PATH = `${API_BASE_URL}/v1/guesses`;

export enum Direction {
  Up = "up",
  Down = "down",
}

export interface Guess {
  createdAt: string;
  playerId: string;
  priceWhenCreated: number;
  direction: Direction;
}

export async function fetchActiveGuess(accessToken: string): Promise<Guess | undefined> {
  const response = await fetch(BASE_PATH, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not get active guess");
  }

  const { activeGuess } = await response.json();

  return activeGuess;
}

export async function postGuess(accessToken: string, direction: Direction): Promise<Guess> {
  const response = await fetch(BASE_PATH, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      direction,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not make a guess");
  }

  const guess = await response.json();

  return guess;
}
