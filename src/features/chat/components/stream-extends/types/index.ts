export type UploadAttachmentPreviewProps<
  AttachmentType,
  RetryAttachmentType = AttachmentType,
> = {
  attachment: AttachmentType;
  handleRetry: (attachment: RetryAttachmentType) => void;
  removeAttachments: (attachmentIds: string[]) => void;
};

export enum RecordingAttachmentType {
  VOICE_RECORDING = 'voice-recording',
}
