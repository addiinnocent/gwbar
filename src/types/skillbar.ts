import type { Attribute } from '@/types';

export type Skillbar = {
  type: number,
  version: number,
  primary: number,
  secondary: number,
  attributes: Partial<Record<Attribute, number>>,
  skills: number[];
  template: string;
}