'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { TeamContext } from '@/context/team';

function ProfessionList() {
  const { team } = useContext(TeamContext);
  const nextId = team.length ? Math.max(...team.map(x => x.id)) + 1 : 1;
  const professions = [
    'Warrior',
    'Ranger',
    'Monk',
    'Necromancer',
    'Mesmer',
    'Elementalist',
    'Assassin',
    'Ritualist',
    'Paragon',
    'Dervish'
  ];

  return (
    <ul role="list" className="mt-4 max-h-[400px] flex list-none flex-col gap-2 overflow-auto">
      {professions.map(profession => (
        <DialogClose key={profession} asChild>
          <Link href={`/${nextId}/${profession}`}>
            <Card className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800" asChild>
              <li className="flex flex-row items-center gap-4">
                <Image
                  src={`/class_icons/${profession}-tango-icon-200.png`}
                  alt={profession}
                  width={40}
                  height={40}
                /> {profession}
              </li>
            </Card>
          </Link>
        </DialogClose>
      ))}
    </ul>
  );
}

export default function NewBuildDialog({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose your profession:</DialogTitle>
          <DialogDescription/>
        </DialogHeader>

        <ProfessionList />
          
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="ghost">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}