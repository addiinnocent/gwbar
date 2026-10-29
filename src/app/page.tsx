import Link from 'next/link';
import Container from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import NewBuildDialog from '@/components/dialog/NewBuildDialog';

export default async function Home() {
  return (
    <main> 
      <Container>
        <section className="mt-10 flex flex-col items-center">
          <div className="flex items-center gap-2 rounded border bg-gray-50 p-2 text-gray-500 dark:bg-gray-800 dark:border-gray-500">
            <span className="mt-0.5 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold leading-none text-amber-800">
              New!
            </span>

            <span className="text-sm">This is a changelog to follow the development.</span>

            <Link href="/changelog" className="text-sm font-bold text-amber-500 transition duration-100 hover:text-amber-600 active:text-amber-700">
              More
            </Link>
          </div>

          <div className="flex max-w-xl flex-col items-center pb-0 pt-8 text-center sm:pb-16 lg:pb-32 lg:pt-32">
            <p className="mb-4 font-semibold text-amber-500 md:mb-6 md:text-lg xl:text-xl">
              Very proud to introduce:
            </p>

            <h1 className="mb-8 text-4xl font-bold sm:text-5xl md:mb-12 md:text-6xl">
              Guild Wars Skill Bar Builder
            </h1>

            <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 xl:text-lg">
              Build and customize skill bars with ease. Plan your strategies, test different setups, and organize your team compositions all in one place.
            </p>

            <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
              <NewBuildDialog>
                <Button className="text-lg px-8">
                  Create a Build
                </Button>
              </NewBuildDialog>

              <Link href="/teams">
                <Button variant="secondary" className="w-full text-lg px-8">
                  Manage Teams
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
