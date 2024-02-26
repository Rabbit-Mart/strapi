import type { Attribute } from '../..';

export type Password = Attribute.OfType<'password'>;

export type PasswordValue = string;

export type GetPasswordValue<T extends Attribute.Attribute> = T extends Password
  ? PasswordValue
  : never;
