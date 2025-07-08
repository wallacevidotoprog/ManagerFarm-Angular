import { Role } from '../Models/enum/auth.enum';

export type RespAuth = {
  user_name: string;
  role: Role;
};
