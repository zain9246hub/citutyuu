
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, USERS } from "../types/chat";

// Cities array matching the one used in Index.tsx
const CITIES = [
  "All Cities",
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata",
  "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur",
  "Bhopal", "Indore", "Patna", "Chandigarh", "Raipur", "Ranchi",
  "Bhubaneswar", "Thiruvananthapuram", "Gandhinagar", "Shimla", "Dehradun",
  "Coimbatore", "Mysore", "Visakhapatnam", "Nagpur", "Vadodara", "Thane",
  "Goa", "Udaipur", "Pondicherry", "Amritsar", "Varanasi", "Agra",
  "Kochi", "Mangalore", "Nashik", "Aurangabad", "Guwahati", "Shillong",
  "Ludhiana", "Rajkot", "Faridabad", "Gurgaon", "Noida",
];

export const useMessages = () => {
  // Initialize messages with city-based chat rooms
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const initialMessages: Record<string, Message[]> = {};
    CITIES.forEach(city => {
      initialMessages[city] = [];
    });
    return initialMessages;
  });
  
  const [activeChat, setActiveChat] = useState<string | null>("All Cities");
  
  const chats = CITIES;

  // Function to send a message
  const sendMessage = useCallback(
    (content: string, contentType: "text" | "voice" = "text") => {
      if (!activeChat) return;

      const newMessage: Message = {
        id: uuidv4(),
        sender: "You",
        content,
        contentType,
        timestamp: new Date(),
        status: "sent",
        seenBy: [],
      };

      setMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || []), newMessage],
      }));

      // Simulate receiving messages to mimic a real chat
      if (Math.random() > 0.3) {
        setTimeout(() => {
          simulateReply(activeChat);
        }, 1000 + Math.random() * 2000);
      }
    },
    [activeChat]
  );

  // Add voice message function
  const addVoiceMessage = useCallback(
    (chatId: string, audioUrl: string) => {
      if (!chatId) return;
      
      const newMessage: Message = {
        id: uuidv4(),
        sender: "You",
        content: "Voice message",
        contentType: "voice",
        timestamp: new Date(),
        status: "sent",
        seenBy: [],
        audioUrl,
      };

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));
      
      // Simulate receiving messages to mimic a real chat
      if (Math.random() > 0.3) {
        setTimeout(() => {
          simulateReply(chatId);
        }, 1000 + Math.random() * 2000);
      }
    },
    []
  );

  // Function to simulate replies from other users
  const simulateReply = useCallback(
    (chatId: string) => {
      const otherUser = USERS[Math.floor(Math.random() * (USERS.length - 1)) + 1];
      
      const getCitySpecificResponses = (city: string) => {
        if (city === "All Cities") {
          return [
            "Hey everyone! Anyone from Mumbai here?",
            "Great to connect with people from different cities!",
            "What's the weather like in your city?",
            "Any good local recommendations?",
            "Nice to meet you all!",
          ];
        }
        
        return [
          `Hello from ${city}!`,
          `Anyone know good places to visit in ${city}?`,
          `Weather in ${city} is great today!`,
          `Love connecting with fellow ${city} residents!`,
          `What's happening in ${city} this weekend?`,
          `${city} is such an amazing city!`,
          "Hey there, local here!",
          "Nice to see more people from our city!",
          "Any events happening locally?",
          "Great to connect with neighbors!",
        ];
      };
      
      const responses = getCitySpecificResponses(chatId);
      
      const newMessage: Message = {
        id: uuidv4(),
        sender: otherUser,
        content: responses[Math.floor(Math.random() * responses.length)],
        contentType: "text",
        timestamp: new Date(),
        status: "sent",
        seenBy: ["You"],
      };

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));

      // Update status of previous messages
      setTimeout(() => {
        updateMessageStatus(chatId);
      }, 1000);
    },
    []
  );

  // Function to update message status
  const updateMessageStatus = useCallback((chatId: string) => {
    setMessages((prev) => {
      const updatedMessages = [...(prev[chatId] || [])];
      
      // Update status to delivered or read based on probability
      updatedMessages.forEach((msg, index) => {
        if (msg.sender === "You" && msg.status === "sent") {
          updatedMessages[index] = {
            ...msg,
            status: "delivered",
          };
        } else if (msg.sender === "You" && msg.status === "delivered") {
          // Randomly decide to mark as read
          if (Math.random() > 0.3) {
            const randomUsers = [];
            const seenCount = Math.floor(Math.random() * (USERS.length - 1)) + 1;
            
            for (let i = 0; i < seenCount; i++) {
              randomUsers.push(USERS[i + 1]); // Skip "You"
            }
            
            updatedMessages[index] = {
              ...msg,
              status: "read",
              seenBy: randomUsers,
            };
          }
        }
      });
      
      return {
        ...prev,
        [chatId]: updatedMessages,
      };
    });
  }, []);

  // Initialize with city-specific welcome messages
  useEffect(() => {
    if (messages["All Cities"].length === 0) {
      setTimeout(() => {
        const initialMessage: Message = {
          id: uuidv4(),
          sender: "John",
          content: "Welcome to Public Chat! Connect with people from your city or chat with everyone in All Cities. Select your city from the dropdown above to join local conversations!",
          contentType: "text",
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          status: "read",
          seenBy: ["You", "Emma", "Michael"],
        };
        
        setMessages((prev) => ({
          ...prev,
          "All Cities": [initialMessage],
        }));
      }, 500);
    }
  }, []);

  return {
    messages,
    sendMessage,
    activeChat,
    setActiveChat,
    chats,
    simulateReply,
    addVoiceMessage
  };
};
