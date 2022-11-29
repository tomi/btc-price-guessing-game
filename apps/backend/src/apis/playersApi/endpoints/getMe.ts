import { PlayersRepo } from "../../../persistence/playersRepo";
import * as common from "../../common";

export interface GetMeEndpointConfig {
  playersRepo: PlayersRepo;
}

export const createGetMeEndpoint = ({ playersRepo }: GetMeEndpointConfig) => {
  const getMe: common.OpenApiApiGatewayProxyEventHandler = async (c, event, context) => {
    const { userId } = c.security.jwtAuth;

    const user = await playersRepo.getPlayerById(userId);

    if (!user) {
      return common.create404Response();
    }

    return {
      statusCode: 200,
      headers: common.defaultHeaders,
      body: JSON.stringify(user),
    };
  };

  return getMe;
};
