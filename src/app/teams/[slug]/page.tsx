import Container from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import TeamComponent from '@/components/TeamComponent';
import TeamTitle from '@/components/TeamTitle';
import NewBuildDialog from '@/components/dialog/NewBuildDialog';
import ImportBuildDialog from '@/components/dialog/ImportBuildDialog';
import { prisma } from '@/lib/prisma';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const attributes = await prisma.gw1Attribute.findMany({
    select: { id: true, name_en: true, primary: true, profession: true },
  });

  return (
    <main>
      <Container>
        <section className="mt-10 mb-4">
          <TeamTitle title={slug} />

          <TeamComponent title={slug} attributeMap={attributes} />

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
