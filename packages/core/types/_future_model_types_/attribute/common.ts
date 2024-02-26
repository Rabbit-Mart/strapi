import type { Attribute } from '..';

// TODO: [TS2] Where to move this? Common doesn't really make sense :/
// Any Attribute
export type AnyAttribute =
  | Attribute.BigInteger
  | Attribute.Blocks
  | Attribute.Boolean
  | Attribute.Date
  | Attribute.DateTime
  | Attribute.Decimal
  | Attribute.Email
  | Attribute.Enumeration<string[]>
  | Attribute.Float
  | Attribute.Increments
  | Attribute.Integer
  | Attribute.JSON
  | Attribute.Password
  | Attribute.Relation
  | Attribute.RichText
  | Attribute.String
  | Attribute.Text
  | Attribute.Time
  | Attribute.Timestamp
  | Attribute.UID;
