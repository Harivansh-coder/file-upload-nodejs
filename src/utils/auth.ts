import jwt from "jsonwebtoken";
import { envVariables } from "../utils/env";

/*
 * Function to generate a JWT token for a user
 * @param userID - The ID of the user for whom the token is generated
 * @returns A JWT token as a string
 * @throws Will throw an error if the token generation fails
 */
export const generateToken = (userID: string | number): string => {
  const token = jwt.sign(
    {
      id: userID,
    },
    envVariables.JWT_SECRET_KEY,
    {
      expiresIn: "1d", // token will expire in 1 day
    }
  );

  return token;
};

/*
 * Function to verify if a token is valid
 * @param token - The JWT token to be verified
 * @returns A boolean indicating whether the token is valid or not
 */

export const isValidToken = (token: string): boolean => {
  if (!token) {
    return false;
  }

  try {
    // verify the token using the secret key
    jwt.verify(token, envVariables.JWT_SECRET_KEY);

    // check if the token is expired
    const decoded = jwt.decode(token) as { exp: number };
    const currentTime = Math.floor(Date.now() / 1000); // get current time in seconds
    if (decoded.exp < currentTime) {
      return false; // token is expired
    }

    return true;
  } catch (error) {
    return false;
  }
};
