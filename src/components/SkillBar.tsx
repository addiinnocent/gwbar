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
    <div className="fixed bottom-0 pb-2 pr-8 max-w-2xl bg-white dark:bg-black">
      <div id="gw-skill-bar" className="flex flex-row gap-1">
        {build.map((skill) => (
          <SortableItem key={skill.id} id={skill.id}>
            <div className="relative">
              <Image
                src={parseSkillName(skill.pve_name)}
                alt={skill.pve_name}
                width={100}
                height={100}
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
