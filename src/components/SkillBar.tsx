'use client';

import type { Gw1SkillDesc, Gw1SkillData } from '@prisma/client';

import Image from 'next/image';
import { SortableItem } from '@/components/dnd/SortableItem';
import { parseSkillName } from '@/lib/utils';

type Gw1Skill = Gw1SkillDesc & Gw1SkillData & {
  pve_activation: number;
  pvp_activation: number;
};

export default function SkillBar({
  build
}: {
  build: Gw1Skill[],
}) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl pb-2 px-8 bg-white dark:bg-black">
      <div id="gw-skill-bar" className="flex flex-row gap-1">
        {build.map((skill) => (
          // min-w-0 + flex-1: slots shrink instead of overflowing the bar
          // (flex items with min-width:auto keep their 100px image width and
          // the last slots end up outside the bar element, breaking drop
          // detection on slots 7/8)
          <SortableItem key={skill.id} id={skill.id} className="min-w-0 flex-1">
            <div className="relative aspect-square w-full">
              <Image
                src={parseSkillName(skill.pve_name)}
                alt={skill.pve_name}
                fill
                className="object-contain"
              />
              {skill.elite ? (
                <span className="absolute inset-0 border-4 border-yellow-500" />
              ): (
                <span />
              )}
            </div>
          </SortableItem>
        ))}
      </div>
    </div>
  );
}
