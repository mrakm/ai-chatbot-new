import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { redirect } from 'next/navigation';

export default async function Page() {
  const id = generateUUID();

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType="private"
        isReadonly={false}
        autoResume={false}
      />
      <DataStreamHandler />
    </>
  );
}