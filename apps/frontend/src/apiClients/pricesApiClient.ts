import { API_BASE_URL } from "../config";

const BASE_PATH = `${API_BASE_URL}/v1/prices`;

export interface Price {
  id: "BTC-USD";
  value: number;
  updatedAt: string;
}

export async function fetchCurrentPrice(accessToken: string): Promise<Price> {
  const response = await fetch(`${BASE_PATH}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current price");
  }

  const price = await response.json();

  return price;
}
