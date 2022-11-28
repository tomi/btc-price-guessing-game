import OpenAPIBackend from "openapi-backend";
import path from "path";
import { JwtService } from "../../domain/jwtService";
import { GuessesRepo } from "../../persistence/guessesRepo";

import * as endpoints from "./endpoints";
import * as common from "../common";
import { PricesRepo } from "../../persistence/pricesRepo";

export interface GuessesApiConfig {
  jwtService: JwtService;
  guessesRepo: GuessesRepo;
  pricesRepo: PricesRepo;
}

export const createGuessesApi = (config: GuessesApiConfig) => {
  const guessesApi = new OpenAPIBackend({
    definition: path.join(__dirname, "../apiSpecs/guessesApi.yaml"),
    quick: true,
  });

  guessesApi.register({
    ...common.defaultErrorHandlers,
    createGuess: endpoints.createCreateGuessEndpoint(config),
    getActiveGuess: endpoints.createGetActiveEndpoint(config),
    guessesCors: common.defaultOptionsRoute,
  });

  guessesApi.registerSecurityHandler("jwtAuth", common.createJwtAuthHandler(config.jwtService));

  guessesApi.init();

  return guessesApi;
};
