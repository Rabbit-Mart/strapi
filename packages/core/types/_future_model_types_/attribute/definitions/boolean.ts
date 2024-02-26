import type { Attribute } from '../..';

export type Boolean = Attribute.OfType<'boolean'>;

export type BooleanValue = boolean;

export type GetBooleanValue<T extends Attribute.Attribute> = T extends Boolean
  ? BooleanValue
  : never;
