import { createJwt } from "../../domain/jwt";
import { PlayersRepo } from "../../persistence/playersRepo";
import { OpenApiApiGatewayProxyEventHandler } from "../apiTypes";
import * as common from "./common";

export interface RegisterPlayerEndpointConfig {
  signingKey: string;
  playersRepo: PlayersRepo;
}

export const createRegisterPlayerEndpoint = ({
  playersRepo,
  signingKey,
}: RegisterPlayerEndpointConfig) => {
  const registerPlayer: OpenApiApiGatewayProxyEventHandler = async (c, event, context) => {
    const body = c.request.requestBody;

    const newPlayer = await playersRepo.persistPlayer(body.name);

    const accessToken = await createJwt(signingKey, newPlayer.id);

    return {
      statusCode: 200,
      headers: common.defaultHeaders,
      body: JSON.stringify({
        accessToken,
      }),
    };
  };

  return registerPlayer;
};
