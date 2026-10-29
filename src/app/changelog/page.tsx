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

export default async function Changelog() {
  const data: Array<{
    branch: string
    commit: string
    author: string
    status: string
    lastEdited: string
  }> = [
    {
      branch: 'Initial',
      commit: 'Changelog created',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '26/01/2025 12:22'
    }, {
      branch: 'Initial',
      commit: 'Local storage for teams',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '26/01/2025 12:31'
    }, {
      branch: 'Initial',
      commit: 'Add PVE skills for each profession',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '27/01/2025 10:30'
    }, {
      branch: 'Initial',
      commit: 'Add a second profession',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '27/01/2025 13:51'
    }, {
      branch: 'Initial',
      commit: 'Create build-ready version',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '27/01/2025 16:20'
    }, {
      branch: 'Initial',
      commit: 'Updated PVE images to high resolution (Thanks Baldrian!)',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '29/01/2025 10:40'
    }, {
      branch: 'Initial',
      commit: 'Manage multiple teams',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '01/02/2025 15:06'
    }, {
      branch: 'Initial',
      commit: 'Save teams and builds locally',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '01/02/2025 15:06'
    }, {
      branch: '1.1',
      commit: 'Mobile optimizations',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '02/02/2025 18:39'
    }, {
      branch: '1.1',
      commit: 'Drop a player from the team',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '04/02/2025 13:21'
    }, {
      branch: '1.1',
      commit: 'Added costs to skill list',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '06/02/2025 12:32'
    }, {
      branch: '1.1',
      commit: 'Added anniversary elite images',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '06/02/2025 12:32'
    }, {
      branch: '1.1',
      commit: 'Toast window to show skill text',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '07/02/2025 15:45'
    }, {
      branch: '1.1',
      commit: 'Added skill cost to description',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '10/02/2025 19:04'
    }, {
      branch: '1.1',
      commit: 'Slight UI changes',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '12/02/2025 18:54'
    }, {
      branch: '1.2',
      commit: 'Import templates',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '12/02/2025 15:06'
    }, {
      branch: '1.2',
      commit: 'Drop a skill back from the bar',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '16/02/2025 18:51'
    }, {
      branch: '1.2',
      commit: 'Show template codes',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '16/02/2025 19:35'
    }, {
      branch: '1.2',
      commit: 'Added a button to c&p templates',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '16/02/2025 19:52'
    }, {
      branch: '1.2',
      commit: 'Added a back button',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '17/02/2025 13:20'
    }, { //STILL TO DO!!!!
      branch: '1.2',
      commit: 'Update anniversary elite ids',
      author: 'Der Dachs',
      status: 'pending',
      lastEdited: '16/02/2025 19:53'
    }, {
      branch: '1.3',
      commit: 'Builds can be imported by URL',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '25/02/2025 10:27'
    }, {
      branch: '1.3',
      commit: 'Shows skill type in the info',
      author: 'Der Dachs',
      status: 'live',
      lastEdited: '25/02/2025 11:13'
    },
  ];
  data.reverse();

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
                    <TableCell>{item.branch}</TableCell>
                    <TableCell className="break-words whitespace-normal">
                      {item.commit}
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
