import OpenAPIBackend from "openapi-backend";
import path from "path";
import { PlayersRepo } from "../persistence/playersRepo";

import * as endpoints from "./endpoints";
import { defaultErrorHandlers } from "./endpoints/common";

export interface PlayersApiConfig {
  signingKey: string;
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
  });

  // init api
  playersApi.init();

  return playersApi;
};
