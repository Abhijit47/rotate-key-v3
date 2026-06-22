import { cn } from '@/lib/utils';

export default function SectionDescription(props: SectionDescriptionProps) {
  return (
    <p
      className={cn(
        props.className ? props.className : 'text-secondary-600',
        props.align === 'left' ? 'text-left' : '',
        props.align === 'right' ? 'text-right' : '',
        props.align === 'center' ? 'text-center' : '',
        'text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl',
      )}
    >
      {props.children}
    </p>
  );
}
