import { notFound } from 'next/navigation';

import { Chat } from '@/components/chat';
import { getMessagesByChatId } from '@/lib/db/queries';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { convertToUIMessages } from '@/lib/utils';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  if (messagesFromDb.length === 0) {
    notFound();
  }

  const uiMessages = convertToUIMessages(messagesFromDb);

  return (
    <>
      <Chat
        id={id}
        initialMessages={uiMessages}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        autoResume={true}
      />
      <DataStreamHandler />
    </>
  );
}