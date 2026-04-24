'use client';

import type { BetterAuthDevtoolsProps } from 'better-auth-devtools/react';
import { BetterAuthDevtools } from 'better-auth-devtools/react';

export function AuthDevtoolsWrapper({
  panelProps,
}: {
  panelProps: BetterAuthDevtoolsProps;
}) {
  return <BetterAuthDevtools {...panelProps} />;
}
