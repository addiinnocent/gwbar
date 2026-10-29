'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import NewBuildDialog from '@/components/dialog/NewBuildDialog';
import { TeamContext } from '@/context/team';

export default function ClassPanel() {
  const { team } = useContext(TeamContext);

  return (
    <div className="fixed left-2 top-10 w-10 bg-white shadow rounded-full opacity-75 dark:bg-gray-900">
      {team.map(x => (
        <Link
          key={x.id}
          href={`/${x.id}/${x.first}?secondary=${x.second}`}
        >
          <Image
            src={`/class_icons/${x.first}-tango-icon-200.png`}
            alt={x.first}
            width={40}
            height={40}
            className="p-2"
          />
        </Link>
      ))}

      <NewBuildDialog>
        <span className="cursor-pointer">
          <Image
            src="/class_icons/Plus-grey-200.png"
            alt="Plus"
            width={40}
            height={40}
            className="p-2"
          />
        </span>
      </NewBuildDialog>
    </div>
  );
}
