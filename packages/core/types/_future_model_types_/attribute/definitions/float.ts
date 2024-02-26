import type { Attribute } from '../..';

export type Float = Attribute.OfType<'float'>;

export type FloatValue = number;

export type GetFloatValue<T extends Attribute.Attribute> = T extends Float ? FloatValue : never;
