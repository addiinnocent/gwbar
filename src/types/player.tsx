import type { Gw1Skill } from '@/types/gw1skill';

export type Player = {
  id: number,
  first: string,
  second: string,
  attributes: Record<string, number>,
  name?: string,
  build: Gw1Skill[],
  template: string,
}
