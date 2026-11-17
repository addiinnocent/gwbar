import fs from 'fs';
import path from 'path';
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

type Entry = {
  version: string;
  change: string;
  author: string;
  status: string;
  lastEdited: string;
};

function parseChangelog(): Entry[] {
  const file = path.join(process.cwd(), 'docs', 'changelog.md');
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  const rows: string[][] = [];
  let inTable = false;
  for (const line of lines) {
    if (line.trim().startsWith('|')) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.every((c) => /^-{2,}$/.test(c) || c === '')) continue;
      rows.push(cells);
      inTable = true;
    } else if (inTable) {
      break;
    }
  }

  return rows
    .filter((cells) => cells.length === 5)
    .map(([version, change, author, status, lastEdited]) => ({
      version,
      change,
      author,
      status,
      lastEdited,
    }))
    .reverse();
}

export default async function Changelog() {
  const data = parseChangelog();

  return (
    <main>
      <Container>
        <section className="mt-16">
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            Changelog
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Overview of all changes made, starting from the initial version.
          </p>
          <TableRoot className="mt-8 max-w-2xl">
            <Table className="w-full">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Branch</TableHeaderCell>
                  <TableHeaderCell>Commit</TableHeaderCell>
                  <TableHeaderCell>Author</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="text-right">
                    Last edited
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.version}</TableCell>
                    <TableCell className="break-words whitespace-normal">
                      {item.change}
                    </TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell className="text-right">
                      {item.lastEdited}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableRoot>
        </section>
      </Container>
    </main>
  );
}
