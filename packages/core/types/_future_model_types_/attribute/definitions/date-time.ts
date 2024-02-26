import type { Attribute } from '../..';

export type DateTime = Attribute.OfType<'datetime'>;

// TODO: Use string templates for date formats
export type DateTimeValue = globalThis.Date | string;

export type GetDateTimeValue<T extends Attribute.Attribute> = T extends DateTime
  ? DateTimeValue
  : never;
