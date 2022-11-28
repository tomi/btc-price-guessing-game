import OpenAPIBackend from "openapi-backend";
import path from "path";
import { JwtService } from "../../domain/jwtService";
import { PlayersRepo } from "../../persistence/playersRepo";

import * as endpoints from "./endpoints";
import * as common from "../common";

export interface PlayersApiConfig {
  jwtService: JwtService;
  playersRepo: PlayersRepo;
}

export type PlayersApi = ReturnType<typeof createPlayersApi>;

export const createPlayersApi = (config: PlayersApiConfig) => {
  const playersApi = new OpenAPIBackend({
    definition: path.join(__dirname, "../apiSpecs/playersApi.yaml"),
    quick: true,
  });

  playersApi.register({
    ...common.defaultErrorHandlers,
    registerPlayer: endpoints.createRegisterPlayerEndpoint(config),
    getMe: endpoints.createGetMeEndpoint(config),
    getMeCors: common.defaultOptionsRoute,
  });

  playersApi.registerSecurityHandler("jwtAuth", common.createJwtAuthHandler(config.jwtService));

  // init api
  playersApi.init();

  return playersApi;
};
