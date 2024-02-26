import type { Attribute } from '../..';

export type Email = Attribute.OfType<'email'>;

export type EmailValue = string;

export type GetEmailValue<T extends Attribute.Attribute> = T extends Email ? EmailValue : never;
