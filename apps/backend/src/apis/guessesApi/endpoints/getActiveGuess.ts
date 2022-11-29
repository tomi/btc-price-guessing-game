import { GuessesRepo } from "../../../persistence/guessesRepo";
import * as common from "../../common";

export interface GetActiveEndpointConfig {
  guessesRepo: GuessesRepo;
}

export const createGetActiveEndpoint = ({ guessesRepo }: GetActiveEndpointConfig) => {
  const createGuess: common.OpenApiApiGatewayProxyEventHandler = async (c, event, context) => {
    const { userId: playerId } = c.security.jwtAuth;

    const activeGuess = await guessesRepo.getGuess(playerId);

    return {
      statusCode: 200,
      headers: common.defaultHeaders,
      body: JSON.stringify({ activeGuess }),
    };
  };

  return createGuess;
};
