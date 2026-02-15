import { mockUserSignup } from '@/workflows/user-signup';
import { NextResponse } from 'next/server';
import { start } from 'workflow/api';

export async function POST() {
  // Executes asynchronously and doesn't block your app
  await start(mockUserSignup, ['someone@example.com']);
  return NextResponse.json({
    message: 'User signup workflow started',
  });
}
