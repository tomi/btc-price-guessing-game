import { useMutation } from "react-query";

import { useSignedInAuth } from "./useAuth";
import { Direction, Guess, postGuess } from "../apiClients/guessesApiClient";
import { useStateQuery } from "./stateQuery";

export const useMakeGuessMutation = () => {
  const { accessToken } = useSignedInAuth();
  const stateQuery = useStateQuery();

  const makeGuessMutation = useMutation<Guess | undefined, unknown, Direction>(
    async (direction) => {
      if (!accessToken) return;

      const guess = await postGuess(accessToken, direction);
      await stateQuery.refetch();

      return guess;
    },
    {},
  );

  return makeGuessMutation;
};
