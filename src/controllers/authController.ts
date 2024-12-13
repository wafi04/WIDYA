import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import prisma from "../config/prisma";
import { ResponseHandler } from "../utils/response";
import { CustomRequest } from "../routes/routeDecorators";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // Validasi req
    if (!email || !username || !password) {
      return res
        .status(400)
        .json(ResponseHandler.badRequest("Username and email are required"));
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json(ResponseHandler.badRequest("User already exists"));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    return res.status(201).json(
      ResponseHandler.created(
        {
          ...newUser,
        },
        "Registration successful"
      )
    );
  } catch (error) {
    console.error("Error registrasi:", error);
    return res
      .status(500)
      .json(
        ResponseHandler.error(
          "An error occurred during registration",
          500,
          error instanceof Error ? error.message : "Unknown error"
        )
      );
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res
        .status(400)
        .json(ResponseHandler.badRequest("Email and password are required"));
    }

    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(ResponseHandler.error("Invalid credentials", 401));
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(ResponseHandler.error("Invalid credentials", 401));
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json(
      ResponseHandler.success(
        {
          token,
          user: userWithoutPassword,
        },
        "Login successful"
      )
    );
  } catch (error) {
    console.error("Error login:", error);
    return res
      .status(500)
      .json(
        ResponseHandler.error(
          "An error occurred during login",
          500,
          error instanceof Error ? error.message : "Unknown error"
        )
      );
  }
};

export const getUserProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    console.log(req.user);
    if (!req.user) {
      res.status(401).json(ResponseHandler.badRequest("Unauthorized"));
      return;
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res
      .status(200)
      .json(ResponseHandler.success(userProfile, "Request Success"));
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      message: "Error retrieving profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
