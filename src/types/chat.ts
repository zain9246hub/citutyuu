
export type MessageStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  sender: string;
  content: string;
  contentType: "text" | "voice";
  timestamp: Date;
  status: MessageStatus;
  seenBy: string[];
  audioUrl?: string;
}

// Mock users for demo purposes
export const USERS = ["You", "John", "Emma", "Michael", "Sophia"];
