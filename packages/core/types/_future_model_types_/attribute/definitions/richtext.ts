import type { Attribute } from '../..';

export type RichText = Attribute.OfType<'richtext'>;

export type RichTextValue = string;

export type GetRichTextValue<T extends Attribute.Attribute> = T extends RichText
  ? RichTextValue
  : never;
