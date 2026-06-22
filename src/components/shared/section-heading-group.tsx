import { cn } from '@/lib/utils';

export default function SectionHeadingGroup(props: SectionHeadingGroupProps) {
  return (
    <hgroup className={cn(props.className ? props.className : '', '')}>
      {props.children}
    </hgroup>
  );
}
