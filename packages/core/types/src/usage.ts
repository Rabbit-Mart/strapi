import type { Schema, Data } from './index';

// registries can then be extended by users
// usage example

type CarSchema = Schema.Schema<'api::car.car'>;
// ^ { uid: "api::car.car", modelType: "contentType", info: { name: "car" }, attributes: { name: { type: "string" }, brand: { type: "relation" } } }

type NameAttribute = Schema.AttributeByName<'api::car.car', 'name'>;
// ^ { type: "string" }

type CarAttributes = Schema.Attributes<'api::car.car'>;
// ^ { name: { type: "string" }, brand: { type: "relation" } }

type CarAttributeKeys = Schema.AttributeNames<'api::car.car'>;
// ^ "name" | "brand"

type C = Schema.AttributeNamesByType<'api::car.car', 'relation', { relation: 'manyToOne' }>;

type D = Data.Entity<'api::car.car'>;

declare const d: D;

const dz = d.brand?.[0]?.dz;

if (dz) {
  dz.forEach((comp) => {
    switch (comp.__component) {
      case 'default.comp':
        console.log(comp.field);
        break;
      case 'default.other':
        console.log(comp.another);
        break;
    }
  });
}

const firstBrand = d.brand?.at(0);

if (firstBrand?.views) {
  const { id, title, views } = firstBrand;

  console.log(views.toPrecision(2));
}
