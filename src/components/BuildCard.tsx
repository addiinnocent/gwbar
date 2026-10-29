/**
 * Read-only build card shared by /build/[slug], /team/[slug] and PlayerContent.
 */
'use client'

import type { Gw1Skill } from '@/types';

import Image from 'next/image';
import { Input } from '@/components/common/Input';
import AttributeChips, { type AttributeChip } from '@/components/AttributeChips';
import { parseSkillName } from '@/lib/utils';

export type SharedBuild = {
  first?: string,
  second?: string,
  attributes?: Record<string, number>,
  attributeList?: AttributeChip[],
  build: Gw1Skill[],
  template: string,
}

export default function BuildCard({
  build,
  showTemplate = true,
  children,
}: {
  build: SharedBuild,
  showTemplate?: boolean,
  children?: React.ReactNode,
}) {
  return (
    <>
      <span>
        <Image
          src={`/class_icons/${build.first}-tango-icon-200.png`}
          alt={build.first ?? ''}
          width={50}
          height={50}
        />
      </span>

      <span className="min-w-0 flex-1">
        <h3 className="font-bold truncate">
          {build.first} / {build.second}
        </h3>

        {build.attributeList && (
          <div className="mb-1">
            <AttributeChips attributes={build.attributeList} />
          </div>
        )}

        <div className="w-full flex flex-row gap-1">
          {build.build.map((skill, i) => (
            <div key={i} className="relative">
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
          ))}
        </div>

        {showTemplate && (
          <Input
            disabled
            type="copy"
            defaultValue={build.template}
          />
        )}

        {children}
      </span>
    </>
  );
}
