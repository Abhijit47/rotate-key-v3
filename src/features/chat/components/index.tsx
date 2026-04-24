'use client';

// import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

export const LazyStreamChatInterface = dynamic(
  () => import('./stream-chat-interface'),
  {
    ssr: false,
    // loading: () => (
    //   <div className={'h-dvh w-full flex items-center justify-center'}>
    //     <Loader className='animate-spin size-8' />
    //     <span className={'sr-only'}>Loading chat interface...</span>
    //   </div>
    // ),
  }
);
