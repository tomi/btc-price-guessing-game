import OpenAPIBackend from "openapi-backend";
import path from "path";
import { JwtService } from "../domain/jwtService";
import { PlayersRepo } from "../persistence/playersRepo";

import * as endpoints from "./endpoints";
import { createJwtAuthHandler, defaultErrorHandlers } from "./endpoints/common";

export interface PlayersApiConfig {
  jwtService: JwtService;
  playersRepo: PlayersRepo;
}

export const createPlayersApi = (config: PlayersApiConfig) => {
  const playersApi = new OpenAPIBackend({
    definition: path.join(__dirname, "../apiSpecs/playersApi.yaml"),
    quick: true,
  });

  playersApi.register({
    ...defaultErrorHandlers,
    registerPlayer: endpoints.createRegisterPlayerEndpoint(config),
    getMe: endpoints.createGetMeEndpoint(config),
  });

  playersApi.registerSecurityHandler("jwtAuth", createJwtAuthHandler(config.jwtService));

  // init api
  playersApi.init();

  return playersApi;
};
