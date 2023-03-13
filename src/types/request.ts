import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    isActive: boolean;
    role: string;
    refreshToken?: string | null;
  };
}
