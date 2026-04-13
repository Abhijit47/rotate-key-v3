import { useEffect, useState } from 'react';

import type { BenefitGrant } from '@polar-sh/sdk/models/components/benefitgrant';
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate';
import type { Subscription } from '@polar-sh/sdk/models/components/subscription';

import { authClient } from '@/lib/auth-client';

export function useCustomerInfo() {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [customerState, setCustomerState] = useState<CustomerState>();
  const [benefits, setBenefits] = useState<BenefitGrant[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const [customerError, setCustomerError] = useState<CustomerStateError>();
  const [benefitError, setBenefitError] = useState<CustomerStateError>();
  const [subscriptionsError, setSubscriptionsError] =
    useState<CustomerStateError>();

  useEffect(() => {
    try {
      async function checkCustomerInfo() {
        setLoading(true);
        const [state, benefits, subscriptions] = await Promise.all([
          authClient.customer.state(),
          authClient.customer.benefits.list({
            query: {
              page: 1,
              limit: 10,
            },
          }),
          authClient.customer.subscriptions.list({
            query: {
              page: 1,
              limit: 10,
              active: true,
            },
          }),
        ]);
        if (!state.data || !benefits.data || !subscriptions.data) {
          setCustomerError(state.error);
          setBenefitError(benefits.error);
          setSubscriptionsError(subscriptions.error);
          setLoading(false);
          setIsError(true);
        } else {
          setCustomerState(state.data);
          setBenefits(benefits.data.result.items);
          setSubscriptions(subscriptions.data.result.items);
          setLoading(false);
        }
      }
      checkCustomerInfo();
    } catch (error) {
      console.error('Error fetching customer data in useUpgradeModal:', error);
    }
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
