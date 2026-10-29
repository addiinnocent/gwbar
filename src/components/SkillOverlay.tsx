'use client';

import type { Gw1Skill } from '@/types';

import Image from 'next/image';
import { Item } from '@/components/dnd/Item';
import { parseSkillName } from '@/lib/utils';

export default function SkillOverlay({
  activeSkill
}: {
  activeSkill?: Gw1Skill,
}) {
  return (
    <div className="w-20 h-20 bg-gray-200">
      <Item>
        {activeSkill && (
          <div className="relative w-20 h-20">
            <Image
              src={parseSkillName(activeSkill.pve_name)}
              alt={activeSkill.pve_name}
              width={100}
              height={100}
            />
            {activeSkill.elite ? (
              <span className="absolute inset-0 border-4 border-yellow-500" />
            ): (
              <span />
            )}
          </div>
        )}
      </Item>
    </div>
  );
}
