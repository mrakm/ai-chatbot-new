import { notFound } from 'next/navigation';

import { Chat } from '@/components/chat';
import { getMessagesByChatId } from '@/lib/db/queries';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { convertToUIMessages } from '@/lib/utils';
import { DataStreamProvider } from '@/components/data-stream-provider';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  if (messagesFromDb.length === 0) {
    notFound();
  }

  const uiMessages = convertToUIMessages(messagesFromDb);

  return (
    <DataStreamProvider>
      <Chat
        id={id}
        initialMessages={uiMessages}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        autoResume={true}
      />
      <DataStreamHandler />
    </DataStreamProvider>
  );
}