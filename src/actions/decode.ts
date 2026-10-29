'use server';

import type {
  Skillbar,
  Attribute,
  Gw1Skill,
} from '@/types';

import { prisma } from '@/lib/prisma';
import {
  binval,
  codetobin,
} from '@/lib/template';

const TEMPLATE_TYPE = 14;

function decodeTemplate(template: string): Skillbar | null {
  const binary = codetobin(template);
  let offset = 0;
  const read = (bits: number) => {
      const out = binary.substr(offset, bits);
      offset += bits;
      return binval(out);
  };
  const templateType = read(4);
  if (templateType != TEMPLATE_TYPE) return null;
  const version = read(4) || 0;
  const professionBitLength = read(2) * 2 + 4;
  const primary = read(professionBitLength);
  const secondary = read(professionBitLength);

  const attributeCount = read(4);
  const attributeBitLength = read(4) + 4;

  const attributes: Partial<Record<Attribute, number>> = {};

  for (let i = 0; i < attributeCount; i++) {
      attributes[read(attributeBitLength) as Attribute] = read(4);
  }

  const skillBitLength = read(4) + 8;

  const skills = new Array(8);
  for (let i = 0; i < 8; i++) {
    skills[i] = read(skillBitLength);
  }

  return {
    type: templateType,
    version,
    primary,
    secondary,
    attributes,
    skills,
    template,
  };
}

async function decode(template: string) {
  const build = decodeTemplate(template);
  if (!build) throw new Error('Sorry. This Build is invalid!');

  const first = await prisma.gw1Profession.findUnique({
    where: { id: build.primary },
    select: { id: true, name_en: true },
  });

  const second = await prisma.gw1Profession.findUnique({
    where: { id: build.secondary },
    select: { id: true, name_en: true },
  });

  const skillData = await prisma.gw1SkillData.findMany({
    where: { id: { in: build.skills } },
  });

  const skillDesc = await prisma.gw1SkillDesc.findMany({
    where: { id: { in: build.skills } },
  });

  const skills: Gw1Skill[] = build.skills.map((skillId: number) => {
    const skill = skillDesc.find(x => x.id === skillId);
    const data = skillData.find(x => x.id === skill?.id);
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

  const attributeIds = Object.keys(build.attributes)
    .map(Number)
    .filter(id => Number.isInteger(id) && id >= 0);

  const attributeRows = attributeIds.length
    ? await prisma.gw1Attribute.findMany({ where: { id: { in: attributeIds } } })
    : [];

  const attributeList = attributeIds
    .map(id => {
      const row = attributeRows.find(a => a.id === id);
      return {
        id,
        name: row?.name_en ?? `Attribute ${id}`,
        rank: build.attributes[id as keyof typeof build.attributes] ?? 0,
        primary: Boolean(row?.primary),
      };
    })
    .filter(a => a.rank > 0);

  return {
    first: first?.name_en,
    second: second?.name_en,
    build: skills,
    attributes: build.attributes,
    attributeList,
    template: template,
  }
}

export async function fromInput(state: object | null, formData: FormData) {
  try {
    const data = await decode(formData.get('code') as string);
    
    return {
      success: true,
      data: data,
    }
  } catch(e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : String(e),
    }
  }
}

export async function fromUrl(template: string) {
  return decode(template);
}