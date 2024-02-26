import type { Struct } from '@strapi/types/internal';
import type { String } from '@strapi/types/utils';
import { mapValues, pick } from 'lodash/fp';

/**
 * List of schema properties that should be kept when sanitizing schemas
 */
const VALID_SCHEMA_PROPERTIES = [
  'collectionName',
  'info',
  'options',
  'pluginOptions',
  'attributes',
  'kind',
  'modelType',
  'modelName',
  'uid',
  'plugin',
  'globalId',
];

/**
 * Sanitize a schemas dictionary by omitting unwanted properties
 * The list of allowed properties can be found here: {@link VALID_SCHEMA_PROPERTIES}
 */
export const mapSchemasValues = (schemas: String.Dict<Struct.Schema>) => {
  return mapValues(pick(VALID_SCHEMA_PROPERTIES), schemas) as String.Dict<Struct.Schema>;
};
