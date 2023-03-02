import { UnauthorizedError } from '../errors';
import { tokenUser } from '../types/user';

const checkPermissions = (requestUser: tokenUser, resourceUserId: string) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.id === resourceUserId) return;
  throw new UnauthorizedError('You are not authorized to access this route');
};

export default checkPermissions;
