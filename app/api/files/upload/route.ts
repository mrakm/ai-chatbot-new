@@ .. @@
 import { put } from '@vercel/blob';
 import { NextResponse } from 'next/server';
 import { z } from 'zod';
 
-import { auth } from '@/app/(auth)/auth';
-
 // Use Blob instead of File since File is not available in Node.js environment
 const FileSchema = z.object({
   file: z
@@ .. @@
 });
 
 export async function POST(request: Request) {
-  const session = await auth();
-
-  if (!session) {
-    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
-  }
-
   if (request.body === null) {
     return new Response('Request body is empty', { status: 400 });
   }