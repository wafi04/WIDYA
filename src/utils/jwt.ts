import jwt from "jsonwebtoken";

// Define an interface for the JWT payload
interface JwtPayload {
  userId: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

// Define a type for the secret key
type JwtSecret = string;

const JWT_SECRET: JwtSecret =
  process.env.JWT_SECRET || "bbaa4efd9edbea173504a6b595ef274c";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    // Use jwt.verify with the defined JwtPayload type
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
