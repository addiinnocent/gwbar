import type { Player } from '@/types';

import { Card } from '@/components/common/Card';
import PlayerContent from '@/components/PlayerContent';
import { fromUrl } from '@/actions/decode';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  // template codes use a base64 alphabet that includes '/', so a shared URL
  // may arrive split across path segments (or %-encoded) — rejoin first
  const template = (await params).slug.join('/');

  const player = await fromUrl(template).catch(() => null);

  const complete = player &&
    player.first && player.second &&
    Array.isArray(player.build) &&
    player.build.length === 8 &&
    player.build.every(skill => skill && skill.pve_name);

  if (!complete) {
    return (
      <main className="m-auto mt-10 max-w-xl">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
          Shared Build:
        </h3>
        <Card className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This build link is invalid.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="m-auto mt-10 max-w-xl">
      <h3 className="font-semibold text-gray-900 dark:text-gray-50">
        Shared Build:
      </h3>
      <Card className="flex flex-row items-center gap-2">
        <PlayerContent
          player={player as unknown as Player}
          attributeList={player.attributeList}
        />
      </Card>
    </main>
  );
}
