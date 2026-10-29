'use client'

import type { Player } from '@/types';

import { useContext } from 'react';
import { Button } from '@/components/common/Button';
import BuildCard from '@/components/BuildCard';
import CopyLinkButton from '@/components/CopyLinkButton';
import { TeamContext } from '@/context/team';

export default function PlayerContent({
  player,
  attributeList,
}: {
  player: Player,
  attributeList?: Array<{ id: number, name: string, rank: number, primary?: boolean }>,
}) {
  const { team, newPlayer } = useContext(TeamContext);

  const addPlayer = () => {
    const nextId = team.length ? Math.max(...team.map(x => x.id)) + 1 : 1;
    newPlayer(
      nextId,
      player.first as string,
      player.second as string,
      player.build,
      player.template,
      (player.attributes as Record<string, number>) ?? {},
    );
  }

  return (
    <BuildCard
      build={{ ...player, attributeList }}
      showTemplate={false}
    >
      <div className="mt-2 flex flex-col gap-2">
        <CopyLinkButton path={`/build/${player.template}`} />
        <Button
          variant="light"
          className="w-full"
          onClick={addPlayer}
        >
          Add to the team
        </Button>
      </div>
    </BuildCard>
  );
}
