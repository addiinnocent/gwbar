'use client'

import { useDroppable } from '@dnd-kit/core';

export function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  
  return (
    <div ref={setNodeRef} className={isOver ? 'text-green-500': ''}>
      {children}
    </div>
  );
}

