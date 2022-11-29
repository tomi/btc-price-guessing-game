import { JwtService } from "../../../domain/jwtService";
import { PlayersRepo } from "../../../persistence/playersRepo";
import { OpenApiApiGatewayProxyEventHandler } from "../../apiTypes";
import * as common from "../../common";
import * as schema from "../playersApi.schema";

export interface RegisterPlayerEndpointConfig {
  jwtService: JwtService;
  playersRepo: PlayersRepo;
}

export const createRegisterPlayerEndpoint = ({
  playersRepo,
  jwtService,
}: RegisterPlayerEndpointConfig) => {
  const registerPlayer: OpenApiApiGatewayProxyEventHandler = async (c, event, context) => {
    const body = c.request.requestBody as schema.components["schemas"]["RegisterPlayerRequest"];

    const newPlayer = await playersRepo.persistPlayer(body.name);

    const accessToken = await jwtService.createJwt(newPlayer.id);

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
