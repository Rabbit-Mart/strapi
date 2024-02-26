import { curry, matchesProperty, pick } from 'lodash/fp';
import type { Struct, UID } from '@strapi/types/internal';

const isOfKind = (kind: unknown) => matchesProperty('kind', kind);

const resolveContentType = (uid: UID.ContentType): Struct.ContentTypeSchema => {
  return strapi.contentTypes[uid];
};

const isNotInSubjects = (subjects: any) => (uid: unknown) =>
  !subjects.find((subject: any) => subject.uid === uid);

const hasProperty = curry((property: unknown, subject: any) => {
  return !!subject.properties.find((prop: any) => prop.value === property);
});

const getValidOptions = pick(['applyToProperties']);

const toSubjectTemplate = (ct: any) => ({
  uid: ct.uid,
  label: ct.info.singularName,
  properties: [],
});

export {
  isOfKind,
  resolveContentType,
  isNotInSubjects,
  hasProperty,
  getValidOptions,
  toSubjectTemplate,
};
