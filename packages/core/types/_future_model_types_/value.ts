import type { Model, UID } from '..';

// Model Value

export type Value<TModelUID extends UID.Model = UID.Model> = {
  [TAttributeName in Model.AttributeKeys<TModelUID>]?: Model.Attribute.Value<
    Model.AttributeByName<TModelUID, TAttributeName>
  >;
};

// namespace API {
//   export namespace Car {
//     export type Car = Document.Document<'car'>;
//     /**
//      *
//      * orm.find(): User
//      * strapi.document('car').find(): APICarCar
//      *
//      * strapi.documents<infer Car & { foo: 'bar' }>('car').find(): Car
//      * Omit<Car, privateFields>
//      */
//   }
// }

// declare function find<T>(uid: T):;
// const car: Document.Document<'api::car.car'>;

// 1. Internal APIs (Schema/Attributes) - No models
//    Simple namespaces/names changes (use Entity as a placeholder for Document & co)

// 2. End-user DX - Doc with type API examples (services, params, etc...)
//    Public/Private - Generated Namespaces w/ type aliases - Overall DX
//    -> Output a document with examples & proposition, can be iterative

// 3. Anticipate V5 (new APIs/data structures)
//    Can wait for later, V5 is still being refactored, no point in starting working on it right now
//    Can start thinking about it and proposing changes, but will be theory only for now

// ?. Content API (consumer) - Input (body,query) / Output? > Useful for SDK
