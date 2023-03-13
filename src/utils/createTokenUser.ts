import { User, tokenUser } from '../types/user';

const createTokenUser = (user: User): tokenUser => {
  const tokenUser: tokenUser = {
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive,
    role: user.role,
    refreshToken: user.refreshToken ?? null,
  };
  return tokenUser;
};

export default createTokenUser;
