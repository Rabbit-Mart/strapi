import type { Public, UID, Utils } from '..';
import type * as Attribute from './attribute';

export type Models = Public.Registries.Models;

export type Model<TModelUID extends UID.Model> = Models[TModelUID];

export type Attributes<TModelUID extends UID.Model> = Model<TModelUID>['attributes'];

export type AttributeByName<
  TModelUID extends UID.Model,
  TAttributeName extends AttributeKeys<TModelUID>
> = Attributes<TModelUID>[TAttributeName];

export type AttributeKeysByType<
  TModelUID extends UID.Model,
  TAttributeType extends Attribute.Kind,
  TCondition = unknown
> = Utils.Object.KeysBy<Attributes<TModelUID>, Attribute.OfType<TAttributeType> & TCondition>;

export type AttributesByType<
  TModelUID extends UID.Model,
  TAttributeType extends Attribute.Kind,
  TCondition = unknown
> = Utils.Object.PickBy<Attributes<TModelUID>, Attribute.OfType<TAttributeType> & TCondition>;

export type AttributeKeys<TModelUID extends UID.Model> = Extract<
  keyof Attributes<TModelUID>,
  string
>;

// region Additional Exports
export * as Attribute from './attribute';
export * from './value';
// endregion
