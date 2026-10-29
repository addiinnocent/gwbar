import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Item } from './Item';

type SortableItemProps = {
  id: string | number;
  children: React.ReactNode;
};

export function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : undefined,
  };
  
  return (
    <Item ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </Item>
  );
}
