import { useQuery } from "react-query";
import { useSignedInAuth } from "./useAuth";
import { fetchActiveGuess, Guess } from "../apiClients/guessesApiClient";
import { fetchPlayer, Player } from "../apiClients/playersApiClient";
import { fetchCurrentPrice, Price } from "../apiClients/pricesApiClient";

export interface State {
  player: Player;
  price: Price;
  activeGuess?: Guess;
}

export async function fetchState(accessToken: string): Promise<State> {
  const [player, price, activeGuess] = await Promise.all([
    fetchPlayer(accessToken),
    fetchCurrentPrice(accessToken),
    fetchActiveGuess(accessToken),
  ]);

  return {
    player,
    price,
    activeGuess,
  };
}

export const useStateQuery = () => {
  const { accessToken } = useSignedInAuth();

  const stateQuery = useQuery(["state", accessToken], () => fetchState(accessToken!), {
    enabled: !!accessToken,
    staleTime: 5 * 1000, // 5s
    refetchInterval: 5 * 1000, // 5s
  });

  return stateQuery;
};
