'use server';

import { headers } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { cache } from 'react';
import { auth } from './auth';

export const requireUnAuth = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/',RedirectType.replace);
  }
});
