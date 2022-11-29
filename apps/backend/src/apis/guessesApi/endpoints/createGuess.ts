import { GuessesRepo } from "../../../persistence/guessesRepo";
import { PricesRepo } from "../../../persistence/pricesRepo";
import * as common from "../../common";
import * as schema from "../guessesApi.schema";

export interface CreateGuessEndpointConfig {
  guessesRepo: GuessesRepo;
  pricesRepo: PricesRepo;
}

export const createCreateGuessEndpoint = ({
  guessesRepo,
  pricesRepo,
}: CreateGuessEndpointConfig) => {
  const createGuess: common.OpenApiApiGatewayProxyEventHandler = async (c, event, context) => {
    // TODO: it would be nicer if ajv also validated this, but
    // it seems it doesn't check enum values
    const body = c.request.requestBody as schema.components["schemas"]["CreateGuessRequest"];
    if (!["up", "down"].includes(body.direction)) {
      return common.create400Response({
        err: "direction must be either 'up' or 'down'",
      });
    }

    const { userId: playerId } = c.security.jwtAuth;

    // If these were bounded contexts this should actually be a call that
    // goes thru an interface (e.g. HTTP) instead of directly accessing
    // the persistance layer
    const currentPrice = await pricesRepo.getPriceById("BTC-USD");
    if (!currentPrice?.value) {
      return common.create503Response({
        err: "Price is not currently available. Try again later",
      });
    }

    // There's chance of a (slight) race condition here, but it shouldn't
    // matter in reality as the last guess will stay effective
    const existingGuess = await guessesRepo.getGuess(playerId);
    if (existingGuess) {
      return common.create409Response({
        err: "A guess already exists. Wait until it has been resolved",
      });
    }

    const guess = await guessesRepo.createGuess({
      direction: body.direction,
      playerId,
      priceWhenCreated: currentPrice.value,
    });

    return {
      statusCode: 200,
      headers: common.defaultHeaders,
      body: JSON.stringify(guess),
    };
  };

  return createGuess;
};
