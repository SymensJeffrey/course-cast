'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
    >
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
