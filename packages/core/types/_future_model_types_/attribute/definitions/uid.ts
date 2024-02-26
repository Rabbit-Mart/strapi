import type { Attribute } from '../..';

export interface UIDOptions {
  separator?: string;
  lowercase?: boolean;
  decamelize?: boolean;
  customReplacements?: Array<[string, string]>;
  preserveLeadingUnderscore?: boolean;
}

export type UID<
  TTargetAttribute extends string = string,
  TOptions extends UIDOptions = UIDOptions
> = Attribute.OfType<'uid'> &
  // Properties
  UIDProperties<TTargetAttribute, TOptions>;

export interface UIDProperties<
  TTargetAttribute extends string = string,
  TOptions extends UIDOptions = UIDOptions
> {
  targetField?: TTargetAttribute;
  options?: UIDOptions & TOptions;
}

export type UIDValue = string;

export type GetUIDValue<TAttribute extends Attribute.Attribute> = TAttribute extends UID
  ? UIDValue
  : never;
