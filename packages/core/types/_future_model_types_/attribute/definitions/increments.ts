import type { Attribute } from '../..';

export type Increments = Attribute.OfType<'increments'>;

export type IncrementsValue = number;

export type GetIncrementsValue<T extends Attribute.Attribute> = T extends Increments
  ? IncrementsValue
  : never;
