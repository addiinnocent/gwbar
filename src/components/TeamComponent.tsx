'use client'

import type { Player } from '@/types';
import type { PlayerPatch } from '@/context/team';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useContext, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import AttributeChips, { type AttributeChip } from '@/components/AttributeChips';
import CopyLinkButton from '@/components/CopyLinkButton';
import { TeamContext } from '@/context/team';
import { Profession } from '@/types';
import { parseSkillName } from '@/lib/utils';

type AttributeMapEntry = {
  id: number,
  name_en: string,
  primary: number,
  profession: number,
};

export default function TeamComponent({
  title,
  attributeMap = [],
}: {
  title: string,
  attributeMap?: AttributeMapEntry[],
}) {
  const { team, selectTeam, updatePlayer, dropPlayer } = useContext(TeamContext);

  useEffect(() => {
    return selectTeam(title);
  }, [title]);

  const sharePath = team.length
    ? `/team/${team.map(player => player.template).join('-')}`
    : '';

  return (
    <div className="flex flex-col gap-2">
      {team.length > 0 && (
        <CopyLinkButton
          path={sharePath}
          label="Share Team"
          variant="light"
        />
      )}

      {team.map(player => (
        <PlayerCard
          key={player.id}
          player={player}
          attributeMap={attributeMap}
          onUpdate={updatePlayer}
          onDrop={dropPlayer}
        />
      ))}
    </div>
  );
}

function PlayerCard({
  player,
  attributeMap,
  onUpdate,
  onDrop,
}: {
  player: Player,
  attributeMap: AttributeMapEntry[],
  onUpdate: (id: number, patch: PlayerPatch) => void,
  onDrop: (id: number) => void,
}) {
  const chips = useMemo<AttributeChip[]>(() => {
    const primaryProfessionId = Profession[player.first as keyof typeof Profession] ?? 0;
    const primaryAttributeId = attributeMap.find(
      a => a.primary && a.profession === primaryProfessionId
    )?.id;

    return Object.entries(player.attributes ?? {})
      .map(([id, rank]) => ({
        id: Number(id),
        rank: Number(rank),
      }))
      .filter(a => Number.isInteger(a.id) && a.rank > 0)
      .sort((a, b) => b.rank - a.rank)
      .map(a => ({
        name: attributeMap.find(entry => entry.id === a.id)?.name_en ?? `Attribute ${a.id}`,
        rank: a.rank,
        primary: a.id === primaryAttributeId,
      }));
  }, [player.attributes, player.first, attributeMap]);

  return (
    <Card
      id={`player-card-${player.id}`}
      className="flex flex-row items-center gap-2"
    >
      <span>
        <Image
          src={`/class_icons/${player.first}-tango-icon-200.png`}
          alt={player.first}
          width={50}
          height={50}
        />
      </span>

      <span className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="font-bold truncate">
            {player.first} / {player.second}
          </h3>
          <input
            type="text"
            defaultValue={player.name ?? ''}
            maxLength={40}
            placeholder="Add a build name..."
            onBlur={e => onUpdate(player.id, { name: e.target.value })}
            aria-label="Build name"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-400 outline-none border-b border-transparent hover:border-gray-300 focus:border-amber-500 dark:hover:border-gray-700 dark:focus:border-amber-500"
          />
        </div>

        <div className="mb-1">
          <AttributeChips attributes={chips} />
        </div>

        <div className="w-full flex flex-row gap-1">
          {player.build.map((skill, i) => (
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

        <Input
          disabled
          type="copy"
          defaultValue={player.template}
        />
      </span>

      <span className="mx-auto flex flex-col gap-1">
        <Link href={`/${player.id}/${player.first}?secondary=${player.second}`}>
          <Button variant="light">
            Customize
          </Button>
        </Link>
        <Button
          variant="light"
          onClick={(e) => {
            e.preventDefault();
            onDrop(player.id);
          }}
        > Remove
        </Button>
      </span>
    </Card>
  );
}
