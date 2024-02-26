import type { Attribute } from '../..';

export type Decimal = Attribute.OfType<'decimal'>;

export type DecimalValue = number;

export type GetDecimalValue<T extends Attribute.Attribute> = T extends Decimal
  ? DecimalValue
  : never;
