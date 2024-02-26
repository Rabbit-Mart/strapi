/// <reference types="vite/client" />

import type { StrapiTheme } from '@strapi/design-system';
import type { Attribute } from '@strapi/types/schema';
import type { Features } from '@strapi/types/modules';
import type { BaseEditor } from 'slate';
import type { HistoryEditor } from 'slate-history';
import type { ReactEditor } from 'slate-react';

import type { LinkEditor } from './src/content-manager/pages/EditView/components/FormInputs/BlocksInput/plugins/withLinks';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends StrapiTheme {}
}

declare module 'slate' {
  interface CustomTypes {
    Editor: Omit<BaseEditor & ReactEditor & HistoryEditor & LinkEditor, 'children'> & {
      children: Attribute.BlocksValue;
    };
    Element: Attribute.BlocksNode;
    Descendant: Attribute.BlocksInlineNode | Text;
    Text: Attribute.BlocksTextNode;
  }
}

interface BrowserStrapi {
  backendURL: string;
  isEE: boolean;
  future: {
    isEnabled: (name: keyof Features.FeaturesService['config']) => boolean;
  };
  features: {
    SSO: 'sso';
    AUDIT_LOGS: 'audit-logs';
    REVIEW_WORKFLOWS: 'review-workflows';
    isEnabled: (featureName?: string) => boolean;
  };
  flags: {
    promoteEE?: boolean;
    nps?: boolean;
  };
  projectType: 'Community' | 'Enterprise';
  telemetryDisabled: boolean;
}

declare global {
  interface Window {
    strapi: BrowserStrapi;
  }
}
