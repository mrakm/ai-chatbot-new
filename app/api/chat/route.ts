import 'server-only';
import dbConnect from './mongodb';
import { 
  ChatModel, 
  MessageModel, 
  VoteModel, 
  DocumentModel, 
  SuggestionModel, 
  StreamModel,
  type Chat,
  type DBMessage,
  type Document,
  type Suggestion,
  type Vote
} from './schema';
import type { ArtifactKind } from '@/components/artifact';
import type { VisibilityType } from '@/components/visibility-selector';
import { ChatSDKError } from '../errors';

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    await dbConnect();
    const newChat = new ChatModel({
      id,
      userId,
      title,
      visibility,
      createdAt: new Date()
    });
    return await newChat.save();
  } catch (error) {
    console.error('Failed to save chat', error);
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    await dbConnect();
    return await ChatModel.findOne({ id }).lean();
  } catch (error) {
    console.error('Failed to get chat by id', error);
    throw error;
  }
}

export async function getChatsByUserId({
  id,
  limit = 10,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit?: number;
  startingAfter?: string | null;
  endingBefore?: string | null;
}) {
  try {
    await dbConnect();
    
    let query = ChatModel.find({ userId: id });
    
    if (startingAfter) {
      const startingChat = await ChatModel.findOne({ id: startingAfter }).lean();
      if (startingChat) {
        query = query.where('createdAt').lt(startingChat.createdAt);
      }
    } else if (endingBefore) {
      const endingChat = await ChatModel.findOne({ id: endingBefore }).lean();
      if (endingChat) {
        query = query.where('createdAt').gt(endingChat.createdAt);
      }
    }
    
    const chats = await query
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();
    
    const hasMore = chats.length > limit;
    
    if (hasMore) {
      chats.pop();
    }
    
    return {
      chats,
      hasMore
    };
  } catch (error) {
    console.error('Failed to get chats by user id', error);
    throw error;
  }
}

export async function saveMessages({
  messages: messagesToSave,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    await dbConnect();
    return await MessageModel.insertMany(messagesToSave);
  } catch (error) {
    console.error('Failed to save messages', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    await dbConnect();
    return await MessageModel.find({ chatId: id }).sort({ createdAt: 1 }).lean();
  } catch (error) {
    console.error('Failed to get messages by chat id', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    await dbConnect();
    const existingVote = await VoteModel.findOne({ chatId, messageId });
    
    if (existingVote) {
      existingVote.isUpvoted = type === 'up';
      return await existingVote.save();
    }
    
    const newVote = new VoteModel({
      chatId,
      messageId,
      isUpvoted: type === 'up'
    });
    
    return await newVote.save();
  } catch (error) {
    console.error('Failed to vote message', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    await dbConnect();
    return await VoteModel.find({ chatId: id }).lean();
  } catch (error) {
    console.error('Failed to get votes by chat id', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    await dbConnect();
    const newDocument = new DocumentModel({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date()
    });
    
    return [await newDocument.save()];
  } catch (error) {
    console.error('Failed to save document', error);
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    await dbConnect();
    return await DocumentModel.find({ id }).sort({ createdAt: 1 }).lean();
  } catch (error) {
    console.error('Failed to get documents by id', error);
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    await dbConnect();
    return await DocumentModel.findOne({ id }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error('Failed to get document by id', error);
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await dbConnect();
    
    // Delete related suggestions
    await SuggestionModel.deleteMany({
      documentId: id,
      documentCreatedAt: { $gt: timestamp }
    });
    
    // Delete documents and return them
    const deletedDocs = await DocumentModel.find({
      id,
      createdAt: { $gt: timestamp }
    }).lean();
    
    await DocumentModel.deleteMany({
      id,
      createdAt: { $gt: timestamp }
    });
    
    return deletedDocs;
  } catch (error) {
    console.error('Failed to delete documents by id after timestamp', error);
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    await dbConnect();
    return await SuggestionModel.insertMany(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions', error);
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    await dbConnect();
    return await SuggestionModel.find({ documentId }).lean();
  } catch (error) {
    console.error('Failed to get suggestions by document id', error);
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    await dbConnect();
    return await MessageModel.findOne({ id }).lean();
  } catch (error) {
    console.error('Failed to get message by id', error);
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    await dbConnect();
    
    // Find messages to delete
    const messagesToDelete = await MessageModel.find({
      chatId,
      createdAt: { $gte: timestamp }
    }).lean();
    
    const messageIds = messagesToDelete.map(message => message.id);
    
    if (messageIds.length > 0) {
      // Delete related votes
      await VoteModel.deleteMany({
        chatId,
        messageId: { $in: messageIds }
      });
      
      // Delete messages
      return await MessageModel.deleteMany({
        chatId,
        id: { $in: messageIds }
      });
    }
  } catch (error) {
    console.error('Failed to delete messages by chat id after timestamp', error);
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await dbConnect();
    
    // Delete related votes
    await VoteModel.deleteMany({ chatId: id });
    
    // Delete related messages
    await MessageModel.deleteMany({ chatId: id });
    
    // Delete related streams
    await StreamModel.deleteMany({ chatId: id });
    
    // Delete and return the chat
    const deletedChat = await ChatModel.findOneAndDelete({ id }).lean();
    return deletedChat;
  } catch (error) {
    console.error('Failed to delete chat by id', error);
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    await dbConnect();
    return await ChatModel.updateOne(
      { id: chatId },
      { $set: { visibility } }
    );
  } catch (error) {
    console.error('Failed to update chat visibility by id', error);
    throw error;
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    await dbConnect();
    const newStream = new StreamModel({
      id: streamId,
      chatId,
      createdAt: new Date()
    });
    
    await newStream.save();
  } catch (error) {
    console.error('Failed to create stream id', error);
    throw error;
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    await dbConnect();
    const streams = await StreamModel.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();
    
    return streams.map(stream => stream.id);
  } catch (error) {
    console.error('Failed to get stream ids by chat id', error);
    throw error;
  }
}