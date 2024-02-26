import type { MiddlewareFactory } from '@strapi/types/core';

export const enableFeatureMiddleware: MiddlewareFactory = (featureName: string) => (ctx, next) => {
  if (strapi.ee.features.isEnabled(featureName)) {
    return next();
  }

  ctx.status = 404;
};

export default {
  enableFeatureMiddleware,
};
