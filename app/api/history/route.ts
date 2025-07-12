@@ .. @@
-import { auth } from '@/app/(auth)/auth';
 import type { NextRequest } from 'next/server';
 import { getChatsByUserId } from '@/lib/db/queries';
 import { ChatSDKError } from '@/lib/errors';
 
 export async function GET(request: NextRequest) {
@@ .. @@
     return new ChatSDKError(
       'bad_request:api',
       'Only one of starting_after or ending_before can be provided.',
     ).toResponse();
   }
 
-  const session = await auth();
-
-  if (!session?.user) {
-    return new ChatSDKError('unauthorized:chat').toResponse();
-  }
-
   const chats = await getChatsByUserId({
-    id: session.user.id,
+    id: 'anonymous',
     limit,
     startingAfter,
     endingBefore,
   });
 
   return Response.json(chats);
 }