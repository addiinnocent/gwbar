'use client'

import { useState } from 'react';
import { RiLinkM } from '@remixicon/react';
import { Button } from '@/components/common/Button';
import { Toaster } from '@/components/common/Toaster';
import { useToast } from '@/lib/useToast';

export default function CopyLinkButton({
  path,
  label = 'Copy Link',
  variant = 'primary',
}: {
  path: string,
  label?: string,
  variant?: 'primary' | 'light',
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Could not copy',
        description: url,
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Toaster />
      <Button
        variant={copied ? 'light' : variant}
        className="w-full"
        onClick={handleCopy}
      >
        <RiLinkM className="size-4" />
        {copied ? 'Copied!' : label}
      </Button>
    </>
  );
}
