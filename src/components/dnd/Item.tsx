import React, { forwardRef, ReactNode, HTMLAttributes } from 'react';

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(({ children, className, ...props }, ref) => {
  return (
    <div {...props} className={className} ref={ref}>
      {children}
    </div>
  );
});

Item.displayName = 'Item';
