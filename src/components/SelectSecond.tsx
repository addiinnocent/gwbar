'use client'

import type { Gw1Attribute, Gw1Profession } from '@prisma/client';

import Image from 'next/image';
import {
  useRouter,
  useParams,
  useSearchParams
} from 'next/navigation';
import { useContext } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/common/Select';
import { TeamContext } from '@/context/team';
import { Profession } from '@/types';

export default function SelectSecond({
  defaultValue,
  professions,
  attributes,
}: {
  defaultValue: string,
  professions: Gw1Profession[],
  attributes: Gw1Attribute[],
}) {
  const router = useRouter();
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const { team, updatePlayer } = useContext(TeamContext);

  const handleChange = (value: string) => {
    const id = parseInt(slug as string) || 0;
    const player = team.find(x => x.id === id);

    // drop the ranks spent in the outgoing second profession's attributes
    // (common + first-profession ranks are kept)
    const firstId = Profession[player?.first as keyof typeof Profession] ?? 0;
    const keptAttributes = Object.fromEntries(
      Object.entries(player?.attributes ?? {}).filter(([key]) => {
        const attribute = attributes.find(a => String(a.id) === key);
        return !attribute || attribute.profession === 0 || attribute.profession === firstId;
      })
    );

    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set('secondary', value);
    updatePlayer(id, { second: value, attributes: keptAttributes });

    router.push(`?${newSearchParams.toString()}`);
  }

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {professions.map(profession => (
          <SelectItem
            key={profession.id}
            value={profession.name_en}
          >
            <span className="flex items-center gap-x-2">
              <Image
                src={`/class_icons/${profession.name_en}-tango-icon-200.png`}
                alt={profession.name_en}
                width={20}
                height={20}
              />
              {profession.name_en}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}