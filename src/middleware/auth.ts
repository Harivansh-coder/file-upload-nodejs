import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVariables } from "../utils/env";

type JWTPayload = JwtPayload & {
  id: string;
};

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get access token from header
  const accessToken = req.headers["authorization"]?.split(" ")[1];

  // if access token does not exist, return 401 error
  if (!accessToken) {
    res.status(401).send({
      status: false,
      errors: {
        message: "Unauthorized",
      },
    });
    return;
  }

  jwt.verify(
    accessToken,
    envVariables.JWT_SECRET_KEY,
    (err: any, decoded: any) => {
      if (err || !decoded) {
        res.status(401).send({
          status: false,
          errors: {
            message: "unauthorized or invalid token",
          },
        });
        return;
      }

      // Cast decoded payload to JWTPayload type
      const jwtPayload = decoded as JWTPayload;

      // Attach the user id to the request user object
      req.user = { id: jwtPayload.id };

      next(); // Pass control to the next middleware/handler
    }
  );
};
