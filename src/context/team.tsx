'use client'

import type { Gw1Skill, Player, Team } from '@/types';

import {
  createContext,
  useState,
  useEffect
} from 'react';
import generateUniqueTitle from '@/lib/unique';
import { noSkill } from '@/lib/noSkill';
import { encode } from '@/actions/encode';

//maybe split team and player context

export type PlayerPatch = Partial<Pick<Player, 'second' | 'attributes' | 'name'>>;

type TeamContextType = {
  team: Player[];
  teams: Team[],
  current: string,
  newPlayer: (id: number,
    first: string,
    second?: string,
    build?: Gw1Skill[],
    template?: string,
    attributes?: Record<string, number>,
    name?: string,
  ) => void;
  newTeam: () => Team;
  selectTeam: (title: string) => void;
  renameTeam: (title: string, newTitle: string) => void;
  updateBuild: (id: number, build: Gw1Skill[]) => void;
  updatePlayer: (id: number, patch: PlayerPatch) => void;
  dropPlayer: (id: number) => void;
  dropTeam: (title: string) => void;
}

const time = () => {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

const sanitizeAttributes = (attributes: unknown): Record<string, number> => {
  if (!attributes || typeof attributes !== 'object') return {};
  return Object.fromEntries(
    Object.entries(attributes as Record<string, unknown>)
      .map(([id, rank]) => [id, Number(rank)] as [string, number])
      .filter(([id, rank]) => Number.isInteger(Number(id)) && Number(id) >= 0 && rank > 0)
  );
}

// migrate players saved by older versions (drops stale fields like `count`)
const normalizePlayer = (player: Player): Player => ({
  id: player.id,
  first: player.first,
  second: player.second,
  attributes: sanitizeAttributes(player.attributes),
  name: typeof player.name === 'string' ? player.name : '',
  build: player.build,
  template: player.template,
});

export const TeamContext = createContext<TeamContextType>(
  {} as TeamContextType
);

export const TeamProvider = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const [team, setTeam] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [current, setCurrent] = useState<string>('');


  const newPlayer = (
    id: number,
    first: string,
    second: string = 'none',
    build: Gw1Skill[] = Array.from({ length: 8 }, (_, i) => ({ ...noSkill, id: -(i + 1)})),
    template: string = 'OQAAAAAwAAsgAAgA',
    attributes: Record<string, number> = {},
    name: string = '',
  ) => {
    if (!current.length) {
      const result = newTeam();
      setCurrent(result.title);
    }
    setTeam(prev => {
      const exists = prev.some((player) => player.id === id);
      if (!exists) {
        const player: Player = {
          id: id,
          first: first,
          second: second,
          attributes: attributes,
          name: name,
          build: build,
          template: template,
        }
        return [...prev, player];
      } else {
        console.warn(`Player with id ${id} already exists in the team.`);
        return prev;
      }
    });
  }

  const newTeam = () => {
    const data = {
      title: generateUniqueTitle(teams),
      professions: [],
      lastEdited: time(),
    };
    setTeams([...teams, data]);

    return data;
  }

  const selectTeam = (title: string) => {
    const savedTeam = localStorage.getItem(title);
    if (savedTeam) setTeam(JSON.parse(savedTeam).map(normalizePlayer));
    else setTeam([]);
    setCurrent(title);
  }

  const renameTeam = (title: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === title) return;
    if (teams.some(team => team.title === trimmed)) return;

    setTeams(prev =>
      prev.map(team =>
        team.title === title ? { ...team, title: trimmed } : team
      )
    );
    if (current === title) {
      setCurrent(trimmed);
      const saved = localStorage.getItem(title);
      if (saved) {
        localStorage.setItem(trimmed, saved);
        localStorage.removeItem(title);
      }
    }
  }

  const updateProfessions = (title: string, professions: string[]) => {
    setTeams(prev =>
      prev.map(team =>
        team.title === title? {
          ...team,
          professions: professions,
        }: team
      )
    );
  }

  const updateTimestamp = (title: string) => {
    setTeams(prev =>
      prev.map(team =>
        team.title === title? {
          ...team,
          lastEdited: time(),
        }: team
      )
    );
  }

  const updatePlayer = (
    id: number,
    patch: PlayerPatch
  ) => {
    setTeam((prev) => prev.map(
      player => {
        if (player.id !== id) return player;
        const updated = { ...player, ...patch };
        // keep the template code in sync when the allocation changed
        if (patch.attributes) {
          updated.attributes = sanitizeAttributes(patch.attributes);
          updated.template = encode(
            updated.first,
            updated.second,
            updated.build.map(x => x.id),
            updated.attributes,
          );
        }
        return updated;
      }
    ));
  }

  // ids are stable: removing a player leaves gaps, callers add new players at max + 1
  const dropPlayer = (id: number) => {
    setTeam((prev) => prev.filter(x => x.id !== id));
  }

  const updateBuild = (id: number, build: Gw1Skill[]) => {
    const player = team.find(x => x.id === id);
    if (player) {
      const template = encode(
        player.first,
        player.second,
        build.map(x => x.id),
        player.attributes,
      );
      setTeam((prev) => prev.map(
        player => player.id === id ? { ...player, build, template } : player)
      );
    }
  }

  const dropTeam = (title: string) => {
    if (current == title) {
      setCurrent('');
      setTeam([]);
    }
    setTeams(prev => prev.filter(team => team.title !== title));
    localStorage.removeItem(title);
  }

  useEffect(() => {
    if (current?.length) {
      localStorage.setItem('current', current);
    }
  }, [current]);

  useEffect(() => {
    if (team.length) {
      updateTimestamp(current);
      updateProfessions(current, team.map(x => x.first));
      localStorage.setItem(current, JSON.stringify(team));
    }
  }, [team]);

  useEffect(() => {
    if (teams.length) {
      localStorage.setItem('teams', JSON.stringify(teams));
    }
  }, [teams]);

  useEffect(() => {
    const savedCurrent = localStorage.getItem('current');
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) setTeams(JSON.parse(savedTeams));
    if (savedCurrent) {
      const savedTeam = localStorage.getItem(savedCurrent);
      if (savedCurrent) setCurrent(savedCurrent || '');
      if (savedTeam) setTeam(JSON.parse(savedTeam).map(normalizePlayer));
    }
  }, []);

  return (
    <TeamContext.Provider
      value={{
        team,
        teams,
        current,
        newPlayer,
        newTeam,
        selectTeam,
        renameTeam,
        updateBuild,
        updatePlayer,
        dropPlayer,
        dropTeam
      }}
    > {children}
    </TeamContext.Provider>
  );
}
