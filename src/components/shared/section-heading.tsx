import { cn } from '@/lib/utils';

export default function SectionHeading(props: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        props.className ? props.className : 'text-tertiary-50',
        props.align === 'left' ? 'text-left' : '',
        props.align === 'right' ? 'text-right' : '',
        props.align === 'center' ? 'text-center' : '',
        'text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl space-y-2 md:space-y-4 font-primary font-semibold',
      )}
    >
      {props.children}
    </h2>
  );
}
