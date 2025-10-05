
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  sender: string;
  content: string;
  contentType: "text" | "voice" | "image";
  timestamp: Date;
  status: MessageStatus;
  seenBy: string[];
  audioUrl?: string;
  imageUrl?: string;
}

// Mock users for demo purposes
export const USERS = ["You", "John", "Emma", "Michael", "Sophia"];
