import type { Attribute } from '../..';

export type Date = Attribute.OfType<'date'>;

export type DateValue = globalThis.Date | string;

export type GetDateValue<T extends Attribute.Attribute> = T extends Date ? DateValue : never;
