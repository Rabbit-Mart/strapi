import type { Utils } from '../..';

import type { RelationKind } from './definitions';
import type { ColumnInfo, ColumnType } from './column';

/**
 * List of all the Strapi Model's attribute types
 */
export type Kind = ScalarAttributeKind | RelationalAttributeKind;

export type ScalarAttributeKind =
  | 'biginteger'
  | 'blocks'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'decimal'
  | 'email'
  | 'enumeration'
  | 'float'
  | 'increments'
  | 'integer'
  | 'json'
  | 'password'
  | 'richtext'
  | 'string'
  | 'text'
  | 'time'
  | 'timestamp'
  | 'uid';

export type RelationalAttributeKind = 'relation';

/**
 * Most basic shape of a schema attribute
 */
export type Attribute<TKind extends Kind = Kind> = { type: TKind } & Utils.MatchFirst<
  [
    // Generic
    [Utils.StrictEqual<TKind, Kind>, Scalar | Relational],
    // Scalar
    [Utils.Extends<TKind, ScalarAttributeKind>, Scalar<Utils.Cast<TKind, ScalarAttributeKind>>],
    // Relational
    [
      Utils.Extends<TKind, RelationalAttributeKind>,
      Relational<Utils.Cast<TKind, RelationalAttributeKind>>
    ]
  ]
>;

export interface Scalar<TKind extends ScalarAttributeKind = ScalarAttributeKind> {
  /**
   * Scalar type of the attribute
   */
  type: TKind;

  default?: any;
  required?: boolean;
  unique?: boolean;
  searchable?: boolean;

  columnName?: string;
  column?: ColumnInfo;
  columnType?: ColumnType;
}

export interface Relational<TKind extends RelationalAttributeKind = RelationalAttributeKind> {
  /**
   * Relational type of the attribute
   */
  type: TKind;

  relation: RelationKind.Any;

  // TODO: [TS2] This should be the reponsibility of the relation attribute itself to add those properties
  //             since they aren't common to all kind of relation
  // target: string;
  //
  // useJoinTable?: boolean;
  // morphBy?: string;
  // inversedBy?: string;
  // owner?: boolean;
  //
  // joinTable?: JoinTable | MorphJoinTable;
  // morphColumn?: MorphColumn;
  // joinColumn?: JoinColumn;
}

/**
 * Creates a basic Attribute of type T
 */
export type OfType<T extends Kind> = Attribute<T>;
