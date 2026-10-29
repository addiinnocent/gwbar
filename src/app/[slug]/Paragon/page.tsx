import type { Gw1SkillDesc, Gw1SkillData } from '@prisma/client';

import Image from 'next/image';
import DndWrapper from '@/components/dnd/DndWrapper';
import SkillWindow from '@/components/SkillWindow';
import SelectSecond from '@/components/SelectSecond';
import { prisma } from '@/lib/prisma';

type SearchParams = { [key: string]: string | string[] | undefined };
type Gw1Skill = Gw1SkillDesc & Gw1SkillData & {
  pve_activation: number;
  pvp_activation: number;
};

const first = 'Paragon';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const query = await searchParams;
  const professions = await prisma.gw1Profession.findMany({
    where: { name_en: { not: first } },
  });
  const second = professions.find(
    x => x.name_en == (query.secondary || 'none'),
  ) || professions[0];

  const attributes = await prisma.gw1Attribute.findMany({
    where: { profession: { in: [0, 9, second.id] } },
    orderBy: [
      { profession: 'desc' },
      { name_en: 'asc' },
    ]
  });
  const skillData = await prisma.gw1SkillData.findMany({
    where: {
      profession: { in: [0, 9, second.id] },
      attribute: { in: attributes.map(x => x.id) },
    },
  });
  const skillDesc = await prisma.gw1SkillDesc.findMany({
    where: {
      id: { in: skillData.map(x => x.id) },
    },
    orderBy: { pve_name: 'asc' }
  });

  const allSkills: Gw1Skill[] = skillDesc.map((skill) => {
    const data = skillData.find(x => x.id == skill.id);
    if (data) {
      return {
        ...skill,
        ...data,
        pve_activation: data.pve_activation?.toNumber(),
        pvp_activation: data.pvp_activation?.toNumber(),
      } as Gw1Skill;
    }
    return skill as Gw1Skill;
  });

  return (
    <main> 
      <span className="mt-10 flex flex-row items-center">
        <Image
          src={`/class_icons/${first}-tango-icon-200.png`}
          alt={first}
          width={50}
          height={50}
        />
        <span className="flex flex-row items-center gap-2 font-bold md:text-2xl">
          <h1>{first}</h1>
          <h1>/</h1>
          <SelectSecond
            defaultValue={second.name_en}
            professions={professions}
          />
        </span>
      </span>

      <DndWrapper>
        <SkillWindow
          profession={first}
          attributes={attributes}
          allSkills={allSkills}
        />
      </DndWrapper>
    </main>
  );
}
