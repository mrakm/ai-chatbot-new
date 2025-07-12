'use server';

import { updateChatVisiblityById, getMessageById, deleteMessagesByChatIdAfterTimestamp } from '@/lib/db/queries';
import type { VisibilityType } from '@/components/visibility-selector';

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}

export async function deleteTrailingMessages({
  id,
}: {
  id: string;
}) {
  const message = await getMessageById({ id });
  
  if (message) {
    await deleteMessagesByChatIdAfterTimestamp({
      chatId: message.chatId,
      timestamp: message.createdAt,
    });
  }
}