import { PricesRepo } from "../../../persistence/pricesRepo";
import { OpenApiApiGatewayProxyEventHandler } from "../../apiTypes";
import * as common from "../../common";

export interface GetPriceEndpointConfig {
  pricesRepo: PricesRepo;
}

export const createGetPriceEndpoint = ({ pricesRepo }: GetPriceEndpointConfig) => {
  const getPrice: OpenApiApiGatewayProxyEventHandler = async (c, event, context) => {
    const price = await pricesRepo.getPriceById("BTC-USD");

    if (!price) {
      return common.create404Response();
    }

    return {
      statusCode: 200,
      headers: common.defaultHeaders,
      body: JSON.stringify(price),
    };
  };

  return getPrice;
};
