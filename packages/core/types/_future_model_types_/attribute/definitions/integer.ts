import type { Attribute } from '../..';

export type Integer = Attribute.OfType<'integer'>;

export type IntegerValue = number;

export type GetIntegerValue<T extends Attribute.Attribute> = T extends Integer
  ? IntegerValue
  : never;
