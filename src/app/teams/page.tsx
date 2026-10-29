'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@/components/common/Table';
import Container from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { TeamContext } from '@/context/team';

export default function Teams() {
  const { teams, newTeam, dropTeam } = useContext(TeamContext);
  const router = useRouter();

  return (
    <main> 
      <Container>
        <section className="mt-16">
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            Teams
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Overview of all of your teams, create a new team and edit existing ones.
          </p>
          <TableRoot className="mt-8">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Professions</TableHeaderCell>
                  <TableHeaderCell>
                    Last edited
                  </TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    Remove
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team, i) => (
                  <Link
                    key={i}
                    href={`/teams/${team.title}`}
                    passHref
                    legacyBehavior
                  >
                    <TableRow className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                      <TableCell >
                        {team.title}
                      </TableCell>
                      <TableCell className="flex flex-row flex-wrap">
                        {team.professions.map((x, i) => (
                          <Image  
                            key={i}
                            src={`/class_icons/${x}-tango-icon-200.png`}
                            alt={x}
                            width={25}
                            height={25}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        {team.lastEdited}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            dropTeam(team.title)
                          }}
                        >
                          <Image
                            src={`/class_icons/Cross_grey_200.png`}
                            alt="remove"
                            width={25}
                            height={25}
                            className="ml-auto"
                          />
                        </span>
                      </TableCell>
                    </TableRow>
                  </Link>
                ))}
              </TableBody>
            </Table>
          </TableRoot>

          <Button
            onClick={() => {
              const team = newTeam();
              router.push(`/teams/${team.title}`);
            }}
            className="mt-4"
          >
            Create a new Team
          </Button>
        </section>
      </Container>
    </main>
  );
}
