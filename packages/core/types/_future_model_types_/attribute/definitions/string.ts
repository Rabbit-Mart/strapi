import type { Attribute } from '../..';

export type String = Attribute.OfType<'string'> &
  // Properties
  StringProperties;

export interface StringProperties {
  regex?: RegExp;
}

export type StringValue = string;

export type GetStringValue<T extends Attribute.Attribute> = T extends String ? StringValue : never;
