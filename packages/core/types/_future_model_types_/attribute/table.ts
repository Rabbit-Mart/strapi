import type { InverseJoinColumn, JoinColumn } from './column';
import type { MorphColumn } from '@strapi/database/src/types';

export interface BaseJoinTable {
  name: string;
  joinColumn: JoinColumn;
  inverseJoinColumn: InverseJoinColumn;
  orderBy?: Record<string, 'asc' | 'desc'>;
  on?: Record<string, unknown>;
  pivotColumns: string[];
}

export interface JoinTable extends BaseJoinTable {
  orderColumnName?: string;
  inverseOrderColumnName?: string;
}

export interface OrderedJoinTable extends BaseJoinTable {
  orderColumnName: string;
  inverseOrderColumnName: string;
}

export interface BidirectionalAttributeJoinTable extends JoinTable {
  orderColumnName: string;
  inverseOrderColumnName: string;
}

export interface MorphJoinTable {
  name: string;
  joinColumn: JoinColumn;
  orderBy?: Record<string, 'asc' | 'desc'>;
  on?: Record<string, unknown>;
  pivotColumns: string[];
  morphColumn: MorphColumn;
}
