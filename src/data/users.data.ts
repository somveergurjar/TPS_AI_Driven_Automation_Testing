import { Credentials } from '../types';

export const Users = {
  admin: {
    email:    process.env.USER_EMAIL    ?? '',
    password: process.env.USER_PASSWORD ?? '',
  } as Credentials,

  readOnly: {
    email:    process.env.READONLY_EMAIL    ?? '',
    password: process.env.READONLY_PASSWORD ?? '',
  } as Credentials,
};
