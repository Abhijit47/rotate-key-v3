import { useEffect, useState } from 'react';

import { CustomerBenefitGrant } from '@polar-sh/sdk/models/components/customerbenefitgrant.js';
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate';
import { CustomerSubscription } from '@polar-sh/sdk/models/components/customersubscription.js';
import type { Subscription } from '@polar-sh/sdk/models/components/subscription';

import { authClient } from '@/lib/auth-client';

export function useCustomerInfo() {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [customerState, setCustomerState] = useState<CustomerState>();
  const [benefits, setBenefits] = useState<CustomerBenefitGrant[]>();
  const [subscriptions, setSubscriptions] = useState<
    CustomerSubscription[] | Subscription[]
  >([]);

  const [customerError, setCustomerError] = useState<CustomerStateError | null>(
    null,
  );
  const [benefitError, setBenefitError] = useState<CustomerStateError | null>(
    null,
  );
  const [subscriptionsError, setSubscriptionsError] =
    useState<CustomerStateError | null>(null);

  // Fetch customer state, benefits, and subscriptions on component mount
  useEffect(() => {
    (async function () {
      try {
        const res = await authClient.customer.state();
        if (!res.data) {
          setCustomerError(res.error);
          setLoading(false);
          setIsError(true);
        } else {
          setCustomerState(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(
          'Error fetching customer data in useUpgradeModal:',
          error,
        );
        // eslint-disable-next-line
        setIsError(true);
        setCustomerError({
          status: 500,
          statusText: 'Internal Server Error',
          message: 'Failed to fetch customer data',
        });
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const res = await authClient.customer.benefits.list({
          query: {
            page: 1,
            limit: 12,
          },
        });
        if (!res.data) {
          setBenefitError(res.error);
          setLoading(false);
          setIsError(true);
        } else {
          setBenefits(res.data.result.items);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching benefits in useUpgradeModal:', error);
        // eslint-disable-next-line
        setIsError(true);
        setBenefitError({
          status: 500,
          statusText: 'Internal Server Error',
          message: 'Failed to fetch benefits data',
        });
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const res = await authClient.customer.subscriptions.list({
          query: {
            page: 1,
            limit: 12,
            active: true,
          },
        });
        if (!res.data) {
          setSubscriptionsError(res.error);
          setLoading(false);
          setIsError(true);
        } else {
          setSubscriptions(res.data.result.items);
          setLoading(false);
        }
      } catch (error) {
        console.error(
          'Error fetching customer data in useUpgradeModal:',
          error,
        );
        // eslint-disable-next-line
        setIsError(true);
        setSubscriptionsError({
          status: 500,
          statusText: 'Internal Server Error',
          message: 'Failed to fetch subscriptions data',
        });
        setLoading(false);
      }
    })();
  }, []);

  return {
    customerState,
    benefits,
    subscriptions,
    customerError,
    benefitError,
    subscriptionsError,
    isCustomerLoading: loading,
    isCustomerError: isError,
  };
}
