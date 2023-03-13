import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedUser extends JwtPayload {
  id: string;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
  role: string;
  refreshToken: string;
}
