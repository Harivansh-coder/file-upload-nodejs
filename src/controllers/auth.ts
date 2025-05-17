import { Request, Response } from "express";
import prisma from "../utils/database";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const invalidMessage = {
      status: "error",
      message: "Invalid email or password",
    };

    // if user does not exist, return error
    if (!user) {
      res.status(401).json(invalidMessage);
      return;
    }

    // if user exists then check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json(invalidMessage);
      return;
    }

    // generate token
    const token = generateToken(user.id);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        access_token: token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const signupController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(409).json({
        status: "error",
        message: "User already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        access_token: token,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;

    // Check if token is valid
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });

    // incase the user is deleted from the database
    if (!user || !user.email) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
