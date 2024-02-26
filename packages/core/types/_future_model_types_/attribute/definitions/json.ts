import type { Utils } from '../../..';
import type { Attribute } from '../..';

export type JSON = Attribute.OfType<'json'> &
  // Options
  Attribute.ConfigurableOption &
  Attribute.RequiredOption &
  Attribute.PrivateOption &
  Attribute.WritableOption &
  Attribute.VisibleOption &
  // TODO: should be Utils.JSONValue but it breaks the admin build
  // TODO: [TS2] Investigate before V5
  Attribute.DefaultOption<Utils.JSONPrimitive>;

export type JsonValue = Utils.JSONValue;

export type GetJsonValue<T extends Attribute.Attribute> = T extends JSON ? JsonValue : never;
