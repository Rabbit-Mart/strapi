import type { Utils } from '../..';
import type { Attribute } from '..';

/**
 * Determines if a given attribute type is of a specific kind.
 *
 * @template TAttribute - The attribute type to check.
 * @template TKind - The kind of attribute to compare against.
 */
export type IsOfType<
  TAttribute extends Attribute.Attribute,
  TKind extends Attribute.Kind
> = TAttribute extends {
  type: TKind;
}
  ? true
  : false;

/**
 * Checks whether a given Attribute {@link TAttribute} is scalar.
 *
 * @template TAttribute - The attribute to check.
 */
export type IsScalar<TAttribute extends Attribute.Attribute> = IsOfType<
  TAttribute,
  Attribute.ScalarAttributeKind
>;

/**
 * Checks whether a given Attribute {@link TAttribute} is relational.
 *
 * @template TAttribute - The attribute to check.
 */
export type IsRelational<TAttribute extends Attribute.Attribute> = IsOfType<
  TAttribute,
  Attribute.RelationalAttributeKind
>;

/**
 * Returns the type (as {@link Kind}) of a given attribute.
 *
 * @template TAttribute - Any attribute
 */
export type TypeOf<TAttribute extends Attribute.Attribute> = TAttribute['type'];

/**
 * Represents the actual value of a given attribute {@link TAttribute}.
 *
 * @template TAttribute - The attribute to extract the value from.
 */
export type Value<TAttribute extends Attribute.Attribute, TGuard = unknown> = Utils.Guard.Never<
  {
    // Scalar
    biginteger: Attribute.GetBigIntegerValue<TAttribute>;
    blocks: Attribute.GetBlocksValue<TAttribute>;
    boolean: Attribute.GetBooleanValue<TAttribute>;
    date: Attribute.GetDateValue<TAttribute>;
    datetime: Attribute.GetDateTimeValue<TAttribute>;
    decimal: Attribute.GetDecimalValue<TAttribute>;
    email: Attribute.GetEmailValue<TAttribute>;
    enumeration: Attribute.GetEnumerationValue<TAttribute>;
    float: Attribute.GetFloatValue<TAttribute>;
    increments: Attribute.GetIncrementsValue<TAttribute>;
    integer: Attribute.GetIntegerValue<TAttribute>;
    json: Attribute.GetJsonValue<TAttribute>;
    password: Attribute.GetPasswordValue<TAttribute>;
    richtext: Attribute.GetRichTextValue<TAttribute>;
    string: Attribute.GetStringValue<TAttribute>;
    text: Attribute.GetTextValue<TAttribute>;
    time: Attribute.GetTimeValue<TAttribute>;
    timestamp: Attribute.GetTimestampValue<TAttribute>;
    uid: Attribute.GetUIDValue<TAttribute>;
    // Relational
    relation: Attribute.GetRelationValue<TAttribute>;
  }[Attribute.TypeOf<TAttribute>],
  TGuard
>;
