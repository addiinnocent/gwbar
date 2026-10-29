'use client'

import Link from 'next/link';
import { Button } from '@/components/common/Button';


export default function TopNav({
  href = '/teams',
  label = 'Back to Teams',
}: {
  href?: string,
  label?: string,
}) {
  return (
    <span>
      <Link href={href}>
        <Button isBack variant="ghost">
          {label}
        </Button>
      </Link>
    </span>
  );
}
