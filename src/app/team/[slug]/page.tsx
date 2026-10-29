import Image from 'next/image';
import { Card } from '@/components/common/Card';
import BuildCard from '@/components/BuildCard';
import CopyLinkButton from '@/components/CopyLinkButton';
import { fromUrl } from '@/actions/decode';
import { parseSkillName } from '@/lib/utils';

type DecodedBuild = Awaited<ReturnType<typeof fromUrl>>;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug;
  const codes = slug.split('-').filter(Boolean).slice(0, 8);

  const results = await Promise.all(
    codes.map(code => fromUrl(code).catch(() => null))
  );
  const builds = results.filter(Boolean) as NonNullable<DecodedBuild>[];
  const invalidCount = codes.length - builds.length;

  if (!builds.length) {
    return (
      <main className="m-auto mt-10 max-w-xl">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
          Shared Team:
        </h3>
        <Card className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This team link contains no valid builds.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="m-auto mt-10 max-w-xl">
      <h3 className="font-semibold text-gray-900 dark:text-gray-50">
        Shared Team:
      </h3>
      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
        {builds.length} build{builds.length !== 1 ? 's' : ''}
        {invalidCount > 0 && ` · ${invalidCount} invalid code${invalidCount !== 1 ? 's' : ''} skipped`}
      </p>

      <Card className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
        {builds.map((build, index) => (
          <div key={index} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
            <span className="flex shrink-0">
              <Image
                src={`/class_icons/${build.first}-tango-icon-200.png`}
                alt={build.first ?? ''}
                width={25}
                height={25}
              />
              {build.second && build.second !== 'none' && (
                <Image
                  src={`/class_icons/${build.second}-tango-icon-200.png`}
                  alt={build.second}
                  width={25}
                  height={25}
                  className="opacity-60"
                />
              )}
            </span>
            <span className="hidden sm:flex sm:flex-row sm:gap-1">
              {build.build.map((skill, i) => (
                <span key={i} className="relative block w-[30px] h-[30px]">
                  <Image
                    src={parseSkillName(skill.pve_name)}
                    alt={skill.pve_name}
                    width={30}
                    height={30}
                  />
                  {skill.elite ? (
                    <span className="absolute inset-0 border-2 border-yellow-500" />
                  ) : (
                    <span />
                  )}
                </span>
              ))}
            </span>
          </div>
        ))}
      </Card>

      <div className="mt-4 flex flex-col gap-2">
        {builds.map((build, index) => (
          <Card key={index} className="flex flex-row items-center gap-2">
            <BuildCard build={build} />
          </Card>
        ))}
      </div>

      <div className="mt-4 max-w-xs m-auto">
        <CopyLinkButton
          path={`/team/${builds.map(build => build.template).join('-')}`}
          label="Share this Team"
          variant="light"
        />
      </div>
    </main>
  );
}
