/*
import { useSession } from '@/lib/auth-client';
import { useState } from 'react';
import OnboardModal from '../components/onboard-modal';

export const useOnboardModal = () => {
  const { data, isPending, isRefetching } = useSession();
  const [dismissedForUserId, setDismissedForUserId] = useState<string | null>(
    null,
  );

  const userId = data?.user?.id ?? null;
  const shouldPrompt =
    !!data && !isPending && !isRefetching && !data.user?.isOnboarded;

  const isOpen = shouldPrompt && dismissedForUserId !== userId;

  const handleOpenChange = (open: boolean) => {
    if (!open && userId) {
      setDismissedForUserId(userId);
    }
  };

  const modal = <OnboardModal open={isOpen} onOpenChange={handleOpenChange} />;

  return { modal };
};
*/

/**
 * future upgrade
 */

import { useSession } from '@/lib/auth-client';
import { useCallback, useEffect, useState } from 'react';
import OnboardModal from '../components/onboard-modal';

// const SNOOZE_MS = 3 * 60 * 60 * 1000; // 3 hours
// example testing with 10 seconds
const SNOOZE_MS = 10 * 1000;

export const useOnboardModal = () => {
  const { data, isPending, isRefetching } = useSession();
  const userId = data?.user?.id ?? null;

  const [snoozedUntil, setSnoozedUntil] = useState<number>(0);
  const [now, setNow] = useState(() => Date.now());

  const storageKey = userId ? `onboard-modal:snoozed-until:${userId}` : null;

  const shouldPrompt =
    !!data && !isPending && !isRefetching && !data.user?.isOnboarded;

  useCallback(() => {
    if (!storageKey) {
      setSnoozedUntil(0);
      return;
    }

    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? Number(raw) : 0;
    setSnoozedUntil(Number.isFinite(parsed) ? parsed : 0);
  }, [storageKey]);

  useEffect(() => {
    if (!snoozedUntil || snoozedUntil <= now) return;
    if (typeof window === 'undefined') return;

    const timeout = window.setTimeout(() => {
      setNow(Date.now());
    }, snoozedUntil - now);

    return () => window.clearTimeout(timeout);
  }, [snoozedUntil, now]);

  const isOpen = shouldPrompt && now >= snoozedUntil;

  const handleOpenChange = (open: boolean) => {
    if (open || !storageKey) return;
    if (typeof window === 'undefined') return;

    const nextSnooze = Date.now() + SNOOZE_MS;
    window.localStorage.setItem(storageKey, String(nextSnooze));
    setSnoozedUntil(nextSnooze);
    setNow(Date.now());
  };

  return {
    modal: <OnboardModal open={isOpen} onOpenChange={handleOpenChange} />,
  };
};
