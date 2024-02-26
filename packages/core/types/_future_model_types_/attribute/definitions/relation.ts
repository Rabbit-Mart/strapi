import type { Model, UID, Utils } from '../../..';
import type { Attribute } from '../..';

/**
 * Represents a relation attribute in a Model.
 *
 * @template TRelationKind The type of the relation.
 * @template TTarget The type of the targeted entity.
 */
export type Relation<
  TRelationKind extends RelationKind.Any = RelationKind.Any,
  TTargetUID extends UID.Model = UID.Model
> = Attribute.OfType<'relation'> & { relation: TRelationKind } & Utils.Expression.MatchFirst<
    [
      [
        // Bidirectional (oneToOne, oneToMany, manyToOne, manyToMany)
        Utils.Expression.Extends<TRelationKind, RelationKind.BiDirectional>,
        Bidirectional<Utils.Cast<TRelationKind, RelationKind.BiDirectional>, TTargetUID>
      ],
      [
        // Morph Reference (morphOne, morphMany)
        Utils.Expression.Extends<TRelationKind, RelationKind.MorphReference>,
        MorphReference<Utils.Cast<TRelationKind, RelationKind.MorphReference>, TTargetUID>
      ],
      [
        // Morph Owner (morphToOne, morphToMany)
        Utils.Expression.Extends<TRelationKind, RelationKind.MorphOwner>,
        MorphOwner<Utils.Cast<TRelationKind, RelationKind.MorphOwner>>
      ]
    ],
    // Fallback
    AnyRelation<TTargetUID>
  >;

// region Groups (Bidirectional, MorphReference, MorphOwner, AnyRelation)

/**
 * @returns {OneToOne<TTargetUID>} oneToOne - Defines a {@link OneToOne} bidirectional relation with the target model.
 * @returns {OneToMany<TTargetUID>} oneToMany - Defines a {@link OneToMany} bidirectional relation with the target model.
 * @returns {ManyToOne<TTargetUID>} manyToOne - Defines a {@link ManyToOne} bidirectional relation with the target model.
 * @returns {ManyToMany<TTargetUID>} manyToMany - Defines a {@link ManyToMany} bidirectional relation with the target model.
 *
 * @template TRelationKind - The kind of bidirectional relation. Default is {@link RelationKind.BiDirectional}.
 * @template TTargetUID - The UID of the targeted model. Default is {@link UID.Model}.
 */
export type Bidirectional<
  TRelationKind extends RelationKind.BiDirectional = RelationKind.BiDirectional,
  TTargetUID extends UID.Model = UID.Model
> = {
  oneToOne: OneToOne<TTargetUID>;
  oneToMany: OneToMany<TTargetUID>;
  manyToOne: ManyToOne<TTargetUID>;
  manyToMany: ManyToMany<TTargetUID>;
}[TRelationKind];

/**
 * Represents a morph reference relationship.
 *
 * @template TRelationKind The kind of the relation. Defaults to `RelationKind.MorphReference`.
 * @template TTargetUID The model type of the target.
 */
export type MorphReference<
  TRelationKind extends RelationKind.MorphReference = RelationKind.MorphReference,
  TTargetUID extends UID.Model = UID.Model
> = {
  morphOne: MorphOne<TTargetUID>;
  morphMany: MorphMany<TTargetUID>;
}[TRelationKind];

/**
 * Represents a MorphOwner object.
 *
 * A MorphOwner object allows for specifying the relation kind using a generic type parameter.
 * It has two properties: morphToOne and morphToMany.
 * The morphToOne property represents a one-to-one relation.
 * The morphToMany property represents a one-to-many relation.
 *
 * @typeparam TRelationKind - The relation kind, defaults to RelationKind.MorphOwner.
 * @typedef {Object} MorphOwner - The MorphOwner object.
 * @property {MorphToOne} morphToOne - The one-to-one relation.
 * @property {MorphToMany} morphToMany - The one-to-many relation.
 */
export type MorphOwner<TRelationKind extends RelationKind.MorphOwner = RelationKind.MorphOwner> = {
  morphToOne: MorphToOne;
  morphToMany: MorphToMany;
}[TRelationKind];

/**
 * Represents an AnyRelation, which can be of type Bidirectional, MorphReference, or MorphOwner.
 * @template TTarget - The target model type.
 */
type AnyRelation<TTargetUID extends UID.Model> =
  | Bidirectional<RelationKind.BiDirectional, TTargetUID>
  | MorphReference<RelationKind.MorphReference, TTargetUID>
  | MorphOwner;
// | XWayProperties<RelationKind.XWay, TTarget>

// endregion

// region Bidirectional Relations (oneToOne, oneToMany, manyToOne, manyToMany

/**
 * Represents the common properties of a bidirectional relationship.
 *
 * @typeParam TTarget - The UID of the targeted model.
 * @extends Attribute.OfType<'relation'>
 */
type BidirectionalCommonProperties<TTargetUID extends UID.Model = UID.Model> = {
  target: TTargetUID; // TODO: [TS2] should it be based on the table name instead?

  inversedBy?: string;
  mappedBy?: string;
} & Attribute.OfType<'relation'>;

/**
 * Represents a one-to-one relationship between two models.
 *
 * @template TTarget - The UID of the targeted model.
 * @extends BidirectionalCommonProperties
 */
export type OneToOne<TTargetUID extends UID.Model = UID.Model> = Utils.Simplify<
  BidirectionalCommonProperties<TTargetUID> & {
    relation: 'oneToOne';

    owner?: boolean;

    useJoinTable?: boolean;
    joinTable?: Attribute.JoinTable;
    joinColumn?: Attribute.JoinColumn;
  }
>;

/**
 * Represents a one-to-many relationship between two models.
 *
 * @template TTarget - The UID of the targeted model.
 * @extends BidirectionalCommonProperties
 */
export type OneToMany<TTargetUID extends UID.Model = UID.Model> = Utils.Simplify<
  BidirectionalCommonProperties<TTargetUID> & {
    relation: 'oneToMany';

    owner?: boolean;

    joinTable?: Attribute.OrderedJoinTable;
    joinColumn?: Attribute.JoinColumn;
  }
>;

/**
 * Represents a many-to-one relationship between two models.
 *
 * @template TTarget - The UID of the targeted model.
 * @extends BidirectionalCommonProperties
 */
export type ManyToOne<TTargetUID extends UID.Model = UID.Model> = Utils.Simplify<
  BidirectionalCommonProperties<TTargetUID> & {
    relation: 'manyToOne';

    owner?: boolean;

    useJoinTable?: boolean;
    joinTable?: Attribute.JoinTable;
    joinColumn?: Attribute.JoinColumn;
  }
>;

/**
 * Represents a many-to-many relationship between two models.
 *
 * @template TTarget - The UID of the targeted model.
 * @extends BidirectionalCommonProperties
 * @typedef {object} ManyToMany
 * @property {'manyToMany'} relation - The type of relationship (always 'manyToMany').
 * @property {Attribute.JoinTable} joinTable - The join table used for the relationship.
 */
export type ManyToMany<TTargetUID extends UID.Model = UID.Model> = Utils.Simplify<
  BidirectionalCommonProperties<TTargetUID> & {
    relation: 'manyToMany';

    joinTable: Attribute.JoinTable;
  }
>;

// endregion

// region Morph Reference Relations (morphOne, morphMany)

/**
 * Represents a MorphOne relation.
 *
 * @template TTarget - The type of the target model.
 *
 * @typedef {Utils.Simplify<Attribute.OfType<'relation'> & {
 *   relation: 'morphOne';
 *   target: TTarget;
 *   morphBy: string;
 * }>} MorphOne
 */
export type MorphOne<TTargetUID extends UID.Model = UID.Model> = Utils.Simplify<
  Attribute.OfType<'relation'> & {
    relation: 'morphOne';
    target: TTargetUID;
    morphBy: string;
  }
>;

/**
 * Represents a one-to-many relationship in which a model morphs to many target models.
 *
 * @typeparam {TTarget} TTarget - The target model type that this relationship morphs to.
 * @typedef {Attribute.OfType<'relation'>} MorphMany - The type representing a morphMany relationship.
 * @property {string} relation - The type of relationship, which is 'morphMany'.
 * @property {TTarget} target - The target model type that this relationship morphs to.
 * @property {string} morphBy - The name of the morph column in the target model.
 * @property {Attribute.MorphJoinTable} joinTable - The join table and foreign key information for this relationship.
 */
export type MorphMany<TTargetUID extends UID.Model = UID.Model> = Utils.Simplify<
  Attribute.OfType<'relation'> & {
    relation: 'morphMany';
    target: TTargetUID;
    morphBy: string;
    joinTable: Attribute.MorphJoinTable;
  }
>;

// endregion

// region Morph Owner Relations (morphToOne, morphToMany)

/**
 * Represents a morph to one relationship between two entities.
 *
 * @typedef {Object} MorphToOne
 * @property {'relation'} of - The type of attribute.
 * @property {'morphToOne'} relation - The type of relationship.
 * @property {boolean} [owner] - Indicates whether the current entity is the owner of the relationship.
 * @property {Attribute.MorphColumn} morphColumn - The morph column used for the relationship.
 */
export type MorphToOne = Utils.Simplify<
  Attribute.OfType<'relation'> & {
    relation: 'morphToOne';
    owner?: boolean;
    morphColumn: Attribute.MorphColumn;
  }
>;

/**
 * Represents a "morphToMany" relation attribute.
 *
 * @typedef {Object} MorphToMany
 * @property {string} type - The type of the attribute, which is "relation".
 * @property {string} relation - The type of relation, which is "morphToMany".
 * @property {Attribute.MorphJoinTable} joinTable - The join table used for the relation.
 */
export type MorphToMany = Utils.Simplify<
  Attribute.OfType<'relation'> & {
    relation: 'morphToMany';
    joinTable: Attribute.MorphJoinTable;
  }
>;

// endregion

// region Rules

/**
 * Represents an owner.
 *
 * @interface Owner
 */
export interface Owner {
  inversedBy: string;
}

/**
 * Represents a class WithTarget.
 *
 * @interface
 */
export interface WithTarget {
  target: UID.Model;
}

// endregion

// region Transforms

/**
 * Represents the type of value obtained from a relation attribute.
 *
 * @template TAttribute - The attribute to infer the value from
 * @returns Returns a customized {@link Model.Value} instance if {@link TAttribute} is a valid {@link Relation} attribute, `never` otherwise.
 */
export type GetRelationValue<TAttribute extends Attribute.Attribute> = TAttribute extends Relation<
  infer TRelationKind extends RelationKind.Any,
  infer TTargetUID extends UID.Model
>
  ? {
      // Bidirectional relations xOne (oneToOne/manyToOne) have a target and return a single parametrized Model.Value
      oneToOne: Model.Value<TTargetUID>;
      manyToOne: Model.Value<TTargetUID>;
      // Bidirectional relations xMany (oneToMany/manyToMany) have a target and return a collection of parametrized Model.Value
      oneToMany: Model.Value<TTargetUID>[];
      manyToMany: Model.Value<TTargetUID>[];
      // Morph references relations (morphOne/morphMany) have a target and return parametrized instances of Model.Value (or Model.Value[])
      morphOne: Model.Value<TTargetUID>;
      morphMany: Model.Value<TTargetUID>[];
      // Morph owners relations (morphToOne/morphToMany) don't have a specific target and return generic instances of Model.Value (or Model.Value[])
      // TODO: [TS2] When/How to add type columns (like __component) to the values?
      //             Should it be based on the inferred value of joinTable.morphColumn.typeColumn.name?
      morphToOne: Model.Value;
      morphToMany: Model.Value[];
    }[TRelationKind]
  : never;

/**
 * Represents the `GetRelationTarget` type.
 * Returns the target type of a given relation attribute.
 *
 * @template TAttribute - The attribute type.
 * @typedef {TAttribute extends import('./Attribute').Relation<import('./Attribute').RelationKind.WithTarget, infer TTarget> ? TTarget : never} GetRelationTarget
 * @example
 *   type MyAttribute = import('./Attribute').Relation<import('./Attribute').RelationKind.WithTarget, MyClass>;
 *   type TargetType = GetRelationTarget<MyAttribute>; // Returns `MyClass`
 */
export type GetRelationTarget<TAttribute extends Attribute.Attribute> = TAttribute extends Relation<
  RelationKind.WithTarget,
  infer TTargetUID
>
  ? TTargetUID
  : never;

// endregion

// TODO: [TS2] Maybe try to simplify this, so that it doesn't require a PhD to understand
//       Also, is a duplicate of Schema.Attribute.RelationKind. Might make sense to extract this to common attribute helpers?
//       Except if there are differences between both (no X Way?)
/**
 * Defines different kinds of relations between entities.
 *
 * @namespace RelationKind
 */
export namespace RelationKind {
  type GetOppositePlurality<TPlurality extends RelationKind.Left | RelationKind.Right> = {
    one: 'many';
    One: 'Many';
    many: 'one';
    Many: 'One';
  }[TPlurality];

  export type Plurality = 'one' | 'many';

  export type Left = Lowercase<RelationKind.Plurality>;
  export type Right = Capitalize<RelationKind.Plurality>;

  export type MorphOwner = `morphTo${RelationKind.Right}`;
  export type MorphReference = `morph${RelationKind.Right}`;
  export type Morph = RelationKind.MorphOwner | RelationKind.MorphReference;

  export type BiDirectional = `${RelationKind.Left}To${RelationKind.Right}`;
  export type UniDirectional = RelationKind.MorphReference;

  export type Any = RelationKind.BiDirectional | RelationKind.Morph;

  export type WithTarget = RelationKind.BiDirectional | RelationKind.MorphReference;

  export type WithoutTarget = RelationKind.MorphOwner;

  export type Reverse<TRelationKind extends RelationKind.Any> =
    TRelationKind extends `${infer TLeft extends RelationKind.Left}To${infer TRight extends RelationKind.Right}`
      ? Utils.Expression.If<
          Utils.Expression.Extends<Uppercase<TLeft>, Uppercase<TRight>>,
          TRelationKind,
          `${GetOppositePlurality<TLeft>}To${GetOppositePlurality<TRight>}`
        >
      : TRelationKind;
}
