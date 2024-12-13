// src/types/express/index.d.ts
import { User } from "@prisma/client";

declare module "express-serve-static-core" {
  interface Request {
    user?: Pick<User, "id">;
  }
}

export {};
