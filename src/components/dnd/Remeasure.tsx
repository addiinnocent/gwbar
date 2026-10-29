'use client'

import { useEffect } from 'react';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';

export default function Remeasure({
  ids,
}: {
  ids: UniqueIdentifier[],
}) {
  const { measureDroppableContainers } = useDndContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      measureDroppableContainers(ids);
    }, 350);
    return () => clearTimeout(timeout);
  }, [ids, measureDroppableContainers]);

  return null;
}
