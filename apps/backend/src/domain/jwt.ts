import { sign } from "jsonwebtoken";

export const createJwt = async (secret: string, subject: string) => {
  const jwt = await new Promise((resolve, reject) => {
    sign(
      {},
      secret,
      {
        // This should probably come from a config
        issuer: "https://bitcoinpriceguessing.game",
        expiresIn: "365 days",
        subject: subject,
      },
      (err, signedToken) => {
        if (err) reject(err);
        else resolve(signedToken);
      },
    );
  });

  return jwt;
};
