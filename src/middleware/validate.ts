// middleware to validate request body

import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validateRequestBody =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate request body
      req.body = await schema.parse(req.body);

      next();
    } catch (error: any) {
      res.status(400).json({
        status: false,
        errors: {
          error: error.errors,
        },
      });
    }
  };

export default validateRequestBody;
