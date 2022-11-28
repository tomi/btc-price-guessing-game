import { API_BASE_URL } from "../config";

const BASE_PATH = `${API_BASE_URL}/v1/players`;

class PlayerNotFoundError extends Error {
  constructor() {
    super("Player not found");
  }
}

export interface Player {
  id: string;
  score: number;
  name: string;
}

export async function register(playerName: string) {
  const response = await fetch(`${BASE_PATH}/register`, {
    method: "POST",
    body: JSON.stringify({
      name: playerName,
    }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  const { accessToken } = await response.json();

  return accessToken;
}

export async function fetchPlayer(accessToken: string): Promise<Player> {
  const response = await fetch(`${BASE_PATH}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new PlayerNotFoundError();
    }

    throw new Error("Registration failed");
  }

  const player = await response.json();

  return player;
}
