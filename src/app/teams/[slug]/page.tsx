import Container from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import TeamComponent from '@/components/TeamComponent';
import NewBuildDialog from '@/components/dialog/NewBuildDialog';
import ImportBuildDialog from '@/components/dialog/ImportBuildDialog';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  return (
    <main> 
      <Container>
        <section className="mt-10 mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            {slug}
          </h3>
          <p className="my-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Overview of the skill bars in your team, create a new bar and edit existing ones.
          </p>

          <TeamComponent title={slug} />

          <span className="mt-4 flex flex-row gap-2">
            <NewBuildDialog>
              <Button>
                New Build
              </Button>
            </NewBuildDialog>

            <ImportBuildDialog>
              <Button variant="light">
                Import Build
              </Button>
            </ImportBuildDialog>
          </span>
        </section>
      </Container>
    </main>
  );
}
