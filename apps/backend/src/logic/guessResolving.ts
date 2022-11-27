import { from } from "fromfrom";
import { sub } from "date-fns";

import { CoinPrice } from "../domain/price";
import { GuessResolvingRepo, ResolveResult } from "../persistence/guessResolvingRepo";
import { Direction, Guess } from "../domain/guess";

/**
 * How long to wait before a guess can be resolved after it has
 * been created
 */
const GUESS_RESOLVE_DELAY_IN_S = 60;

export interface ResolveGuessesByNewPriceOpts {
  guessResolvingRepo: GuessResolvingRepo;
  newPrice: CoinPrice;
}

/**
 * Calculates how the given guesses should be resolved based on the
 * given new price
 */
export const calculateResolveResults = (currentPrice: number, guesses: Guess[]) => {
  const results = from(guesses)
    // Skip guesses that had the same initial price as latest price
    .filter((guess) => guess.priceWhenCreated !== currentPrice)
    .map((guess) => {
      const correctDirection =
        guess.priceWhenCreated < currentPrice ? Direction.Up : Direction.Down;
      const wasCorrectGuess = correctDirection === guess.direction;

      const result: ResolveResult = {
        playerId: guess.playerId,
        pointDelta: wasCorrectGuess ? 1 : -1,
      };

      return result;
    })
    .toArray();

  return results;
};

export const resolveGuessesByNewPrice = async ({
  guessResolvingRepo,
  newPrice,
}: ResolveGuessesByNewPriceOpts) => {
  const earliestResolvableTime = sub(new Date(newPrice.updatedAt), {
    seconds: GUESS_RESOLVE_DELAY_IN_S,
  }).toISOString();

  const resolvableGuesses = await guessResolvingRepo.getGuessesBefore(earliestResolvableTime);

  console.info(`Found ${resolvableGuesses.length} guesses that are ready to be resolved`);

  const resolveResults = calculateResolveResults(newPrice.value, resolvableGuesses);

  console.info(`${resolveResults.length}/${resolvableGuesses.length} guesses could be resolved`);

  if (resolveResults.length > 0) {
    await guessResolvingRepo.resolveGuesses(resolveResults);
  }
};
