import type {
  Gw1SkillDesc,
  Gw1SkillData,
} from '@prisma/client';

export type Gw1Skill = Gw1SkillDesc & Gw1SkillData & {
  pve_activation: number;
  pvp_activation: number;
}