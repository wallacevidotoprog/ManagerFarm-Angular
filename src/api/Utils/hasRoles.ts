import { Role } from '../../app/Models/enum/auth.enum';

export function hasRole(roles: Role[]): boolean {
  const role = localStorage.getItem('data-user');
  if (!role) {
    return false;
  }
  const rl = JSON.parse(role).role as Role;
  return roles.includes(rl);
}
