import type { Skillbar } from '@/types';

import {
  valbin,
  bintocode,
  getenumindex
} from '@/lib/template';

const TEMPLATE_TYPE = 14;
const VERSION = 0;

function encodeSkillbar(skillbar: Exclude<Skillbar, 'template'>): string {
  const type = valbin(skillbar.type, 4);
  const version = valbin(skillbar.version, 4);

  const professionBitLength = Math.max(4, valbin(skillbar.primary, 0).length, valbin(skillbar.secondary, 0).length);
  const primary = valbin(skillbar.primary, professionBitLength);
  const secondary = valbin(skillbar.secondary, professionBitLength);

  const attributeCount = valbin(Object.keys(skillbar.attributes).length, 4);
  const attributeBitLength = Math.max(4, ...Object.keys(skillbar.attributes).map(a => valbin(a, 0).length));
  const attributes = Object.entries(skillbar.attributes).reduce((out, [attributeId, attributeLevel]) => {
      return [
          ...out,
          valbin(attributeId, attributeBitLength),
          valbin(attributeLevel!, 4), // eslint-disable-line @typescript-eslint/no-non-null-assertion
      ];
  }, [] as string[]);

  const skillBitLength = Math.max(8, ...skillbar.skills.map(skillId => valbin(skillId, 0).length));
  const skills = skillbar.skills.map(skillId => valbin(skillId, skillBitLength));

  const template = [
      type,
      version,
      valbin(Math.max(Math.ceil((professionBitLength - 4) / 2), 0), 2),
      primary,
      secondary,
      attributeCount,
      valbin(Math.max(attributeBitLength - 4, 0), 4),
      ...attributes,
      valbin(Math.max(skillBitLength - 8, 0), 4),
      ...skills,
  ];

  return bintocode(template.join(''));
}

export function encode(
  primary: string,
  secondary: string,
  skills: number[],
  attributes: Record<string | number, number> = {},
): string {
  try {
    const template = encodeSkillbar({
      type: TEMPLATE_TYPE,
      version: VERSION,
      primary: getenumindex(primary) || 0,
      secondary: getenumindex(secondary) || 0,
      attributes: Object.fromEntries(
        Object.entries(attributes)
          .map(([id, rank]) => [Number(id), rank])
          .filter(([id, rank]) => Number.isInteger(id) && id >= 0 && rank > 0)
      ) as Skillbar['attributes'],
      skills: skills,
      template: '',
    });

    return template;
  } catch(e) {
    console.error(e);
    return e instanceof Error ? e.message : String(e)
  }
}