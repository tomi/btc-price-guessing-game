import { PlayersRepo } from "../../../persistence/playersRepo";
import { OpenApiApiGatewayProxyEventHandler } from "../../apiTypes";
import * as common from "../../common";

export interface GetMeEndpointConfig {
  playersRepo: PlayersRepo;
}

export const createGetMeEndpoint = ({ playersRepo }: GetMeEndpointConfig) => {
  const getMe: OpenApiApiGatewayProxyEventHandler = async (c, event, context) => {
    const { userId } = c.security.jwtAuth;

    const user = await playersRepo.getPlayerById(userId);

    return {
      statusCode: 200,
      headers: common.defaultHeaders,
      body: JSON.stringify(user),
    };
  };

  return getMe;
};
