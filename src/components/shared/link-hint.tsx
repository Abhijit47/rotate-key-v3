'use client';

import { useLinkStatus } from 'next/link';

export default function Hint() {
  const { pending } = useLinkStatus();
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  );
}
