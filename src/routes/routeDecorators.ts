import { Request, Response, NextFunction, RequestHandler } from "express";
import { protect } from "../middleware/authMiddleware";

export interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}

type RouteHandler = (req: CustomRequest, res: Response) => Promise<void>;

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const Authenticated = (handler: RouteHandler): RequestHandler[] => {
  return [
    protect,
    asyncHandler(async (req, res, next) => {
      await handler(req as CustomRequest, res);
      next();
    }),
  ];
};
