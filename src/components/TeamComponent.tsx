'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useContext } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { TeamContext } from '@/context/team';
import { parseSkillName } from '@/lib/utils';

export default function TeamComponent({
  title,
}: {
  title: string
}) {
  const { team, selectTeam, dropPlayer } = useContext(TeamContext);

  useEffect(() => {
    return selectTeam(title);
  }, [title]);

  return (
    <div className="flex flex-col gap-2">
      {team.map(player => (
        <Card
          key={player.id}
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
                dropPlayer(player.id);
              }}
            > Remove
            </Button>
          </span>
        </Card>
      ))}
    </div>
  );
}
