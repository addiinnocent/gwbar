'use client';

import type { Gw1Skill } from '@/types';

import Image from 'next/image';
import SkillCost from '@/components/SkillCost';
import { SortableItem } from '@/components/dnd/SortableItem';
import { parseSkillName } from '@/lib/utils';

export default function SkillList({
  skills
}: {
  skills: Gw1Skill[],
}) {
  return skills.map((skill) => (
    <SortableItem
      key={skill.id}
      id={skill.id}
    >
      <div className="flex flex-row items-center gap-2 bg-gray-200 dark:bg-gray-700">
        <div className="relative w-10 h-10">
          <Image
            src={parseSkillName(skill.pve_name)}
            alt={skill.pve_name}
            width={100}
            height={100}
          />
          {skill.elite ? (
            <div className="absolute inset-0 border-4 border-yellow-500" />
          ): (
            <span />
          )}
        </div>

        <span>
          {skill.pve_name}
        </span>

        <SkillCost skill={skill} />
      </div>
    </SortableItem>
  ));
}
