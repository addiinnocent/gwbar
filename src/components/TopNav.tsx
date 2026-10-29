'use client'

import Link from 'next/link';
import { Button } from '@/components/common/Button';


export default function TopNav() {
  return (
    <span>
      <Link href="/teams">
        <Button isBack variant="ghost">
          Back to Teams
        </Button>
      </Link>
    </span>
  );
}
