import type { Utils } from '../../..';
import type { Attribute } from '../..';

export type Enumeration<TValues extends string[] = []> = Attribute.OfType<'enumeration'> &
  EnumerationProperties<TValues>;

export interface EnumerationProperties<TValues extends string[] = []> {
  enum: TValues;
  enumName?: string;
}

export type EnumerationValue<TValues extends string[]> = Utils.Array.Values<TValues>;

export type GetEnumerationValue<TAttribute extends Attribute.Attribute> =
  TAttribute extends Enumeration<infer TValues> ? EnumerationValue<TValues> : never;
