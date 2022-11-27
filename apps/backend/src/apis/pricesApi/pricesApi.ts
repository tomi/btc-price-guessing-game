import OpenAPIBackend from "openapi-backend";
import path from "path";
import { PricesRepo } from "../../persistence/pricesRepo";

import * as endpoints from "./endpoints";
import { createJwtAuthHandler, defaultErrorHandlers } from "../common";
import { JwtService } from "../../domain/jwtService";

export interface PricesApiConfig {
  jwtService: JwtService;
  pricesRepo: PricesRepo;
}

export const createPricesApi = (config: PricesApiConfig) => {
  const pricesApi = new OpenAPIBackend({
    definition: path.join(__dirname, "../apiSpecs/pricesApi.yaml"),
    quick: true,
  });

  pricesApi.register({
    ...defaultErrorHandlers,
    getPrice: endpoints.createGetPriceEndpoint(config),
  });

  pricesApi.registerSecurityHandler("jwtAuth", createJwtAuthHandler(config.jwtService));

  pricesApi.init();

  return pricesApi;
};
