import { cn } from '@/lib/utils';

export default function SectionWrapper(props: SectionWrapperProps) {
  return (
    <div
      className={cn(
        props.className ? props.className : '',
        'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0',
      )}
    >
      {props.children}
    </div>
  );
}
