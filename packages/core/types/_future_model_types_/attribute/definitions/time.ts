import type { Attribute } from '../..';

export type Time = Attribute.OfType<'time'>;

export type TimeValue = globalThis.Date | string;

export type GetTimeValue<T extends Attribute.Attribute> = T extends Time ? TimeValue : never;
