// Shared Component Types
declare type ElementAlign = 'left' | 'center' | 'right';

declare type SectionWrapperProps = React.ComponentProps<'div'> &
  React.PropsWithChildren<object>;

declare type SectionHeadingGroupProps = React.ComponentProps<'hgroup'> &
  React.PropsWithChildren<object>;

declare type SectionHeadingProps = React.ComponentProps<'h2'> &
  React.PropsWithChildren<{ align?: ElementAlign }>;

declare type SectionDescriptionProps = React.ComponentProps<'p'> &
  React.PropsWithChildren<{ align?: ElementAlign }>;

declare type SectionBadgeProps = React.ComponentProps<'span'> &
  React.PropsWithChildren<{ align?: ElementAlign }>;

declare type SectionHeadingWithDividerProps = React.ComponentProps<
  'div' | 'h2'
> &
  React.PropsWithChildren<{
    dividerColor?: string;
  }>;

declare type SectionBannerProps = React.ComponentProps<'section'> &
  React.PropsWithChildren<{
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    coverImage?: {
      src: string;
      height: number;
      width: number;
      blurDataURL: string | undefined;
      blurWidth: number | undefined;
      blurHeight: number | undefined;
    };
  }>;

declare type SectionOverlayProps = React.PropsWithChildren<{
  description: string;
}>;

declare type CustomerStateError = {
  code?: string;
  message?: string;
  status: number;
  statusText: string;
};

declare type WorkflowTypes =
  | 'welcome-user'
  | 'skipped-onboarding'
  | 'liked-property'
  | 'matched'
  | 'incoming-swap-request';
