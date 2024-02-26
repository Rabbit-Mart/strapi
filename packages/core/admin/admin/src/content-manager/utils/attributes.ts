import type { Attribute } from '@strapi/types/schema';

const checkIfAttributeIsDisplayable = (attribute: Attribute.AnyAttribute) => {
  const { type } = attribute;

  if (type === 'relation') {
    return !attribute.relation.toLowerCase().includes('morph');
  }

  return !['json', 'dynamiczone', 'richtext', 'password', 'blocks'].includes(type) && !!type;
};

export { checkIfAttributeIsDisplayable };
