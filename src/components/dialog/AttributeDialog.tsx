/**
 * Attribute point allocation dialog.
 * Adapted from gw1tools/gw1builds (MIT) — components/editor/attribute-editor-modal.tsx
 */
'use client'

import type { Gw1Attribute } from '@prisma/client';

import Image from 'next/image';
import { useContext, useMemo, useState } from 'react';
import {
  RiAddLine,
  RiSubtractLine,
  RiDeleteBinLine,
} from '@remixicon/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/common/Dialog';
import { Button } from '@/components/common/Button';
import { TeamContext } from '@/context/team';
import { Profession } from '@/types';
import {
  MAX_BASE_ATTRIBUTE_RANK,
  MAX_ATTRIBUTE_POINTS,
  getIncrementalCost,
  calculateTotalPointsSpent,
} from '@/lib/attributes';

export default function AttributeDialog({
  playerId,
  attributes,
  children,
}: {
  playerId: number,
  attributes: Gw1Attribute[],
  children: React.ReactNode,
}) {
  const { team, updatePlayer } = useContext(TeamContext);
  const [open, setOpen] = useState(false);

  const player = team.find(x => x.id === playerId);
  const allocation = useMemo(
    () => player?.attributes ?? {},
    [player]
  );

  const available = useMemo(
    () => attributes.filter(a => a.profession > 0),
    [attributes]
  );

  const primaryAttributeId = useMemo(() => {
    const primaryProfessionId = Profession[player?.first as keyof typeof Profession] ?? 0;
    return attributes.find(a => a.primary && a.profession === primaryProfessionId)?.id;
  }, [attributes, player?.first]);

  const remainingPoints = MAX_ATTRIBUTE_POINTS - calculateTotalPointsSpent(allocation);

  const handleChange = (attributeId: number, delta: number) => {
    const key = String(attributeId);
    const currentRank = allocation[key] ?? 0;
    const newRank = Math.max(0, Math.min(MAX_BASE_ATTRIBUTE_RANK, currentRank + delta));
    if (newRank === currentRank) return;
    if (delta > 0 && getIncrementalCost(currentRank) > remainingPoints) return;

    updatePlayer(playerId, {
      attributes: { ...allocation, [key]: newRank },
    });
  };

  const handleReset = () => {
    const reset: Record<string, number> = {};
    for (const attribute of available) reset[String(attribute.id)] = 0;
    updatePlayer(playerId, { attributes: reset });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attribute Points</DialogTitle>
          <DialogDescription>
            Distribute up to {MAX_ATTRIBUTE_POINTS} points across your primary and
            secondary profession attributes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Points left:
          </span>
          <span
            className={
              'rounded-md px-2 py-1 text-sm font-semibold tabular-nums ' +
              (remainingPoints === 0
                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                : remainingPoints < 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300')
            }
          >
            {remainingPoints} / {MAX_ATTRIBUTE_POINTS}
          </span>
        </div>

        <ul role="list" className="max-h-[50vh] overflow-auto list-none flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {available.map(attribute => (
            <AttributeRow
              key={attribute.id}
              attribute={attribute}
              rank={allocation[String(attribute.id)] ?? 0}
              isPrimary={attribute.id === primaryAttributeId}
              remainingPoints={remainingPoints}
              onChange={(delta) => handleChange(attribute.id, delta)}
            />
          ))}
        </ul>

        <DialogFooter className="mt-4 flex-row items-center justify-between">
          <Button variant="light" onClick={handleReset}>
            <RiDeleteBinLine className="size-4" />
            Reset
          </Button>
          <DialogClose asChild>
            <Button>
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AttributeRow({
  attribute,
  rank,
  isPrimary,
  remainingPoints,
  onChange,
}: {
  attribute: Gw1Attribute,
  rank: number,
  isPrimary: boolean,
  remainingPoints: number,
  onChange: (delta: number) => void,
}) {
  const incrementCost = getIncrementalCost(rank);
  const decrementRefund = rank > 0 ? getIncrementalCost(rank - 1) : 0;
  const canIncrease = rank < MAX_BASE_ATTRIBUTE_RANK && remainingPoints >= incrementCost;
  const profession = Profession[attribute.profession] as string | undefined;

  return (
    <li className="flex items-center gap-3 py-2">
      <Image
        src={`/class_icons/${profession}-tango-icon-200.png`}
        alt={profession ?? ''}
        width={20}
        height={20}
        className="shrink-0 opacity-80"
      />

      <span
        className="flex-1 min-w-0 truncate text-sm text-gray-700 dark:text-gray-300"
        title={attribute.desc_en ?? undefined}
      >
        {isPrimary && (
          <span className="mr-1.5 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            Primary
          </span>
        )}
        {attribute.name_en}
      </span>

      <span className="flex items-center shrink-0">
        <button
          type="button"
          onClick={() => onChange(-1)}
          disabled={rank <= 0}
          aria-label={`Decrease ${attribute.name_en}`}
          title={rank > 0 ? `Refunds ${decrementRefund} point${decrementRefund !== 1 ? 's' : ''}` : undefined}
          className="flex h-8 w-14 items-center justify-center gap-1 rounded-l-md border border-r-0 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span
            className={
              'w-4 text-right text-[10px] font-medium tabular-nums ' +
              (rank > 0 ? '' : 'invisible')
            }
          >
            {decrementRefund}
          </span>
          <RiSubtractLine className="size-4" />
        </button>

        <span
          className={
            'flex h-8 w-10 items-center justify-center border-y text-sm font-bold tabular-nums ' +
            (rank === 0
              ? 'text-gray-400 dark:text-gray-600'
              : isPrimary
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-gray-900 dark:text-gray-100')
          }
        >
          {rank}
        </span>

        <button
          type="button"
          onClick={() => onChange(1)}
          disabled={!canIncrease}
          aria-label={`Increase ${attribute.name_en}`}
          title={canIncrease ? `Costs ${incrementCost} point${incrementCost !== 1 ? 's' : ''}` : rank >= MAX_BASE_ATTRIBUTE_RANK ? 'Maximum rank reached' : 'Not enough points'}
          className="flex h-8 w-14 items-center justify-center gap-1 rounded-r-md border border-l-0 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <RiAddLine className="size-4" />
          <span
            className={
              'w-4 text-left text-[10px] font-medium tabular-nums ' +
              (rank < MAX_BASE_ATTRIBUTE_RANK ? '' : 'invisible')
            }
          >
            {incrementCost}
          </span>
        </button>
      </span>
    </li>
  );
}
