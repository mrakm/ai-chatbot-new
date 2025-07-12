import mongoose, { Schema, model, models, Document as MongoDocument } from 'mongoose';
import type { ArtifactKind } from '@/components/artifact';

// Define interfaces for our models
export interface Chat extends MongoDocument {
  id: string;
  createdAt: Date;
  title: string;
  userId: string;
  visibility: 'public' | 'private';
}

export interface DBMessage extends MongoDocument {
  id: string;
  chatId: string;
  role: string;
  parts: any[];
  attachments: any[];
  createdAt: Date;
}

export interface Vote extends MongoDocument {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

export interface Document extends MongoDocument {
  id: string;
  createdAt: Date;
  title: string;
  content?: string;
  kind: ArtifactKind;
  userId: string;
}

export interface Suggestion extends MongoDocument {
  id: string;
  documentId: string;
  documentCreatedAt: Date;
  originalText: string;
  suggestedText: string;
  description?: string;
  isResolved: boolean;
  userId: string;
  createdAt: Date;
}

export interface Stream extends MongoDocument {
  id: string;
  chatId: string;
  createdAt: Date;
}

// Define schemas
const chatSchema = new Schema<Chat>({
  id: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now },
  title: { type: String, required: true },
  userId: { type: String, required: true },
  visibility: { 
    type: String, 
    required: true, 
    enum: ['public', 'private'],
    default: 'private'
  }
});

const messageSchema = new Schema<DBMessage>({
  id: { type: String, required: true, unique: true },
  chatId: { type: String, required: true, ref: 'Chat' },
  role: { type: String, required: true },
  parts: { type: [Schema.Types.Mixed], required: true },
  attachments: { type: [Schema.Types.Mixed], required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

const voteSchema = new Schema<Vote>({
  chatId: { type: String, required: true, ref: 'Chat' },
  messageId: { type: String, required: true, ref: 'Message' },
  isUpvoted: { type: Boolean, required: true }
});

// Compound index for chatId and messageId to ensure uniqueness
voteSchema.index({ chatId: 1, messageId: 1 }, { unique: true });

const documentSchema = new Schema<Document>({
  id: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  title: { type: String, required: true },
  content: { type: String },
  kind: { 
    type: String, 
    required: true, 
    enum: ['text', 'code', 'image', 'sheet'],
    default: 'text'
  },
  userId: { type: String, required: true }
});

// Compound index for id and createdAt to ensure uniqueness
documentSchema.index({ id: 1, createdAt: 1 }, { unique: true });

const suggestionSchema = new Schema<Suggestion>({
  id: { type: String, required: true, unique: true },
  documentId: { type: String, required: true, ref: 'Document' },
  documentCreatedAt: { type: Date, required: true },
  originalText: { type: String, required: true },
  suggestedText: { type: String, required: true },
  description: { type: String },
  isResolved: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

const streamSchema = new Schema<Stream>({
  id: { type: String, required: true, unique: true },
  chatId: { type: String, required: true, ref: 'Chat' },
  createdAt: { type: Date, required: true, default: Date.now }
});

// Create models (only if they don't already exist)
export const ChatModel = models.Chat || model<Chat>('Chat', chatSchema);
export const MessageModel = models.Message || model<DBMessage>('Message', messageSchema);
export const VoteModel = models.Vote || model<Vote>('Vote', voteSchema);
export const DocumentModel = models.Document || model<Document>('Document', documentSchema);
export const SuggestionModel = models.Suggestion || model<Suggestion>('Suggestion', suggestionSchema);
export const StreamModel = models.Stream || model<Stream>('Stream', streamSchema);