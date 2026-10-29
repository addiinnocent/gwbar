import type { Player } from '@/types';

import { Card } from '@/components/common/Card';
import PlayerContent from '@/components/PlayerContent';
import { fromUrl } from '@/actions/decode';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const template = (await params).slug;
  const player = await fromUrl(template);

  if (!player) return null;

  return (
    <main className="m-auto mt-10 max-w-xl">
      <h3 className="font-semibold text-gray-900 dark:text-gray-50">
        Shared Build:
      </h3>
      <Card className="flex flex-row items-center gap-2">
        <PlayerContent player={player as Player} />
      </Card>
    </main>
  );
}
