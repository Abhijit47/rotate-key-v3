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
