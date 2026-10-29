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

type TeamContextType = {
  team: Player[];
  teams: Team[],
  newPlayer: (id: number,
    first: string,
    second?: string,
    build?: Gw1Skill[],
    template?: string,
  ) => void;
  newTeam: () => void;
  selectTeam: (title: string) => void;
  updateBuild: (id: number, build: Gw1Skill[]) => void;
  updatePlayer: (id: number, second: string) => void;
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
  ) => {
    if (!current.length) {
      const result = newTeam();
      setCurrent(result.title);
    }
    setTeam(prev => {
      const exists = prev.some((player) => player.id === id);
      if (!exists) {
        const player = {
          id: id,
          first: first,
          second: second,
          attributes: {},
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
    if (savedTeam) setTeam(JSON.parse(savedTeam));
    else setTeam([]);
    setCurrent(title);
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
    second: string
  ) => {
    setTeam((prev) => prev.map(
      player => player.id === id ? { ...player, second } : player)
    );
  }

  const dropPlayer = (id: number) => {
    setTeam((prev) => {
      prev = prev.filter(x => x.id !== id);
      prev = prev.map((x, i) => ({...x, id: i+1}));
      return prev;
    });
  }

  const updateBuild = (id: number, build: Gw1Skill[]) => {
    const player = team.find(x => x.id === id);
    if (player) {
      const template = encode(
        player.first,
        player.second,
        build.map(x => x.id),
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
      if (savedTeam) setTeam(JSON.parse(savedTeam));
    }
  }, []);

  return (
    <TeamContext.Provider
      value={{
        team,
        teams,
        newPlayer,
        newTeam,
        selectTeam,
        updateBuild,
        updatePlayer,
        dropPlayer,
        dropTeam
      }}
    > {children}
    </TeamContext.Provider>
  );
}