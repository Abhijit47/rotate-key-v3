// 🔒 Recommended unified check Extract a shared helper:

import type { Attachment } from 'stream-chat';

// utils/chat.ts
export function isPropertyDocumentAttachment(att: Attachment): boolean {
  return (
    att.type === 'file' && !!att.asset_url && att.title === 'Property Document'
  );
}
