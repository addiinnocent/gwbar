'use client';

import type { Gw1SkillDesc, Gw1SkillData } from '@prisma/client';

import Image from 'next/image';
import { decimalToFraction } from '@/lib/utils';

type Gw1Skill = Gw1SkillDesc & Gw1SkillData & {
  pve_activation: number;
  pvp_activation: number;
};

export default function SkillCost({
  skill
}: {
  skill: Gw1Skill,
}) {
  return (
    <span className="ml-auto mr-2 flex flex-row space-x-2 text-xs">
      {skill.pve_adrenaline > 0 && (
        <span className="inline-flex">
          {skill.pve_adrenaline}
          <Image
            src="/class_icons/Tango-adrenaline.png"
            alt="Adrenaline"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </span>
      )}
      {skill.pve_upkeep > 0 && (
        <span className="inline-flex">
          -{skill.pve_upkeep}
          <Image
            src="/class_icons/Tango-upkeep.png"
            alt="Upkeep"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </span>
      )}
      {skill.pve_sacrifice > 0 && (
        <span className="inline-flex">
          {skill.pve_sacrifice}%
          <Image
            src="/class_icons/Tango-sacrifice.png"
            alt="Sacrifice"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </span>
      )}
      {skill.pve_overcast > 0 && (
        <span className="inline-flex">
          {skill.pve_overcast}
          <Image
            src="/class_icons/Tango-overcast.png"
            alt="Overcast"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </span>
      )}
      {skill.pve_energy > 0 && (
        <span className="inline-flex">
          {skill.pve_energy}
          <Image
            src="/class_icons/Tango-energy.png"
            alt="Energy"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </span>
      )}
      {Number(skill.pve_activation) > 0 && (
        <span className="inline-flex">
          {decimalToFraction(skill.pve_activation)}
          <Image
            src="/class_icons/Tango-activation.png"
            alt="Activation"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </span>
      )}
      {skill.pve_recharge > 0 && (
        <span className="inline-flex">
          {skill.pve_recharge}
          <Image
            src="/class_icons/Tango-recharge.png"
            alt="Recharge"
            width={20}
            height={20}
            className="w-4 h-4"
          />
        </span>
      )}
    </span>
  );
}