'use client'

import type { Gw1Profession } from '@prisma/client';

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

export default function SelectSecond({
  defaultValue,
  professions,
}: {
  defaultValue: string,
  professions: Gw1Profession[],
}) {
  const router = useRouter();
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const { updatePlayer } = useContext(TeamContext);

  const handleChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    newSearchParams.set('secondary', value);
    updatePlayer(parseInt(slug as string) || 0, { second: value });

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