import jwt, { JwtPayload } from "jsonwebtoken";

// This should probably come from a config
const ISSUER = "https://bitcoinpriceguessing.game";

export type JwtService = ReturnType<typeof createJwtService>;

export interface JwtServiceConfig {
  secret: string;
}

export const createJwtService = ({ secret }: JwtServiceConfig) => {
  const createJwt = async (subject: string) => {
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        {},
        secret,
        {
          issuer: ISSUER,
          expiresIn: "365 days",
          subject: subject,
        },
        (err, signedToken) => {
          if (err) reject(err);
          else resolve(signedToken);
        },
      );
    });

    return token;
  };

  const verifyJwt = async (token: string) => {
    const verifiedToken = await new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        secret,
        {
          // This should probably come from a config
          issuer: ISSUER,
        },
        (err, verified) => {
          if (err) reject(err);
          else resolve(verified as JwtPayload);
        },
      );
    });

    return verifiedToken;
  };

  return {
    createJwt,
    verifyJwt,
  };
};
