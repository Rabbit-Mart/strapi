import type { ID } from '@strapi/types/data';

export function getRelationLink(targetModel: string, id?: ID) {
  return `/content-manager/collection-types/${targetModel}/${id ?? ''}`;
}
