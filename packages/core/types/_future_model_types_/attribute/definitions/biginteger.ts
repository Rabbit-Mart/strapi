import type { Attribute } from '../..';

export type BigInteger = Attribute.OfType<'biginteger'>;

export type BigIntegerValue = string;

export type GetBigIntegerValue<T extends Attribute.Attribute> = T extends BigInteger
  ? BigIntegerValue
  : never;
