import type { ScalarAttributeKind } from './base';

export interface ColumnType {
  type: string;
  args: unknown[];
}

export interface ColumnInfo {
  unsigned?: boolean;
  defaultTo?: unknown;
}

export interface JoinColumn {
  name: string;
  referencedColumn: string;
  referencedTable?: string;
  columnType?: ScalarAttributeKind;
}

export interface InverseJoinColumn {
  name: string;
  referencedColumn: string;
}

export interface MorphColumn {
  typeField?: string;
  typeColumn: TypeColumn;
  idColumn: IDColumn;
}

export interface TypeColumn {
  name: string;
}

export interface IDColumn {
  name: string;
  referencedColumn: string;
}
