'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

import IntroLoader from './loaders/intro-step-loader';
import Step1Loader from './loaders/step-1-loader';
import Step10Loader from './loaders/step-10-loader';
import Step2Loader from './loaders/step-2-loader';
import Step3Loader from './loaders/step-3-loader';
import Step4Loader from './loaders/step-4-loader';
import Step5Loader from './loaders/step-5-loader';
import Step6Loader from './loaders/step-6-loader';
import Step7Loader from './loaders/step-7-loader';
import Step8Loader from './loaders/step-8-loader';
import Step9Loader from './loaders/step-9-loader';

// const componentPath = {
//   step0: import('./intro-step'),
//   step1: import('./step-1-form'),
//   step2: import('./step-2-form'),
//   step3: import('./step-3-form'),
//   step4: import('./step-4-form'),
//   step5: import('./step-5-form'),
//   step6: import('./step-6-form'),
//   step7: import('./step-7-form'),
//   step8: import('./step-8-form'),
//   step9: import('./step-9-form'),
//   step10: import('./step-10-form'),
// };

const LazyIntroStep = dynamic(() => import('./intro-step'), {
  ssr: false,
  loading: IntroLoader,
});

const LazyStep1 = dynamic(() => import('./step-1-form'), {
  ssr: false,
  loading: Step1Loader,
});
const LazyStep2 = dynamic(() => import('./step-2-form'), {
  ssr: false,
  loading: Step2Loader,
});
const LazyStep3 = dynamic(() => import('./step-3-form'), {
  ssr: false,
  loading: Step3Loader,
});
const LazyStep4 = dynamic(() => import('./step-4-form'), {
  ssr: false,
  loading: Step4Loader,
});
const LazyStep5 = dynamic(() => import('./step-5-form'), {
  ssr: false,
  loading: Step5Loader,
});
const LazyStep6 = dynamic(() => import('./step-6-form'), {
  ssr: false,
  loading: Step6Loader,
});
const LazyStep7 = dynamic(() => import('./step-7-form'), {
  ssr: false,
  loading: Step7Loader,
});
const LazyStep8 = dynamic(() => import('./step-8-form'), {
  ssr: false,
  loading: Step8Loader,
});
const LazyStep9 = dynamic(() => import('./step-9-form'), {
  ssr: false,
  loading: Step9Loader,
});
const LazyStep10 = dynamic(() => import('./step-10-form'), {
  ssr: false,
  loading: Step10Loader,
});

const LazyDevtool = dynamic(
  () => import('@hookform/devtools').then((mod) => mod.DevTool),
  {
    ssr: false,
    loading: () => <Skeleton className='w-10 h-10 animate-pulse' />,
  },
);

export {
  LazyDevtool,
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
};
