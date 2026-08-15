'use client';

import { usePropertyContext } from '@/contexts/property-context';
import {
  LazyIntroStep,
  LazyStep1,
  LazyStep10,
  LazyStep2,
  LazyStep3,
  LazyStep4,
  LazyStep5,
  LazyStep6,
  LazyStep7,
  LazyStep8,
  LazyStep9,
} from './steps';

export default function RenderFormSteps() {
  const { step } = usePropertyContext();

  // use swicth  statement to render the form based on the step
  switch (step) {
    case 0:
      return <LazyIntroStep />;
    case 1:
      return <LazyStep1 />;
    case 2:
      return <LazyStep2 />;
    case 3:
      return <LazyStep3 />;
    case 4:
      return <LazyStep4 />;
    case 5:
      return <LazyStep5 />;
    case 6:
      return <LazyStep6 />;
    case 7:
      return <LazyStep7 />;
    case 8:
      return <LazyStep8 />;
    case 9:
      return <LazyStep9 />;
    case 10:
      return <LazyStep10 />;
    default:
      console.error(`You are in wrong step ${step}`);
      return null;
  }
}
