import type { Attribute } from '../..';

export type Text = Attribute.OfType<'text'> &
  // Properties
  TextProperties;

export interface TextProperties {
  regex?: RegExp;
}

export type TextValue = string;

export type GetTextValue<T extends Attribute.Attribute> = T extends Text ? TextValue : never;
