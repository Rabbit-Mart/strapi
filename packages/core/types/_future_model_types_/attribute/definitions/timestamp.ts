import type { Attribute } from '../..';

export type Timestamp = Attribute.OfType<'timestamp'>;

export type TimestampValue = globalThis.Date | number | string;

export type GetTimestampValue<T extends Attribute.Attribute> = T extends Timestamp
  ? TimestampValue
  : never;
