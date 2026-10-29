'use client'

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TeamContext } from '@/context/team';

export default function TeamTitle({ title }: { title: string }) {
  const { teams, current, renameTeam } = useContext(TeamContext);
  const router = useRouter();
  const [name, setName] = useState(title);

  useEffect(() => {
    setName(title);
  }, [title]);

  const savedTitle = teams.find(t => t.title === current)?.title ?? title;
  const builds = teams.find(t => t.title === savedTitle)?.professions.length ?? 0;

  const handleRename = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === savedTitle) {
      setName(savedTitle);
      return;
    }
    renameTeam(savedTitle, trimmed);
    router.replace(`/teams/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        maxLength={60}
        onChange={e => setName(e.target.value)}
        onBlur={handleRename}
        onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        aria-label="Team name"
        className="w-full max-w-md bg-transparent font-semibold text-gray-900 dark:text-gray-50 outline-none border-b border-transparent hover:border-gray-300 focus:border-amber-500 dark:hover:border-gray-700 dark:focus:border-amber-500"
      />
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {builds} build{builds !== 1 ? 's' : ''} · click the name to rename this team
      </p>
    </div>
  );
}
