'use client'

import type { Player } from '@/types';

import Image from 'next/image';
import { useContext } from 'react';
import { Button } from '@/components/common/Button';
import { TeamContext } from '@/context/team';

import { parseSkillName } from '@/lib/utils';

export default function PlayerContent({
  player,
}: {
  player: Player,
}) {
  const { team, newPlayer } = useContext(TeamContext);

  const addPlayer = () => {
    newPlayer(
      team.length+1,
      player.first as string,
      player.second as string,
      player.build,
      player.template
    );
  }

  return (
    <>
      <span>
        <Image
          src={`/class_icons/${player.first}-tango-icon-200.png`}
          alt="Profession"
          width={50}
          height={50}
        />
      </span>

      <span>
        <h3 className="font-bold">
          {player.first} / {player.second}
        </h3>
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

        <Button
          variant="light"
          className="mt-2 w-full"
          onClick={addPlayer}
        >
          Add to the team
        </Button>
      </span>
    </>
  );
}
