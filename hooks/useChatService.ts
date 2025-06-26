import { useState, useEffect, useCallback } from "react";

import {
  getChatHistory,
  addChatHistory,
  deleteChatHistory,
  renameChatHistory,
  archiveChatHistory,
} from "@/dummy/chatHistoryUtil";

// This hook abstracts chat data logic for easy API integration later
export function useChatService() {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatMessagesById, setChatMessagesById] = useState<any>({});
  const [selectedChat, setSelectedChat] = useState("New Chat");
  const [selectedChatId, setSelectedChatId] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history and messages on mount
  useEffect(() => {
    const history = getChatHistory();

    setChatHistory(history);
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("chatMessagesById")
        : null;

    if (stored) setChatMessagesById(JSON.parse(stored));
    if (history.length > 0) {
      setSelectedChat(history[history.length - 1].title);
      setSelectedChatId(history[history.length - 1].id);
    }
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "chatMessagesById",
        JSON.stringify(chatMessagesById),
      );
    }
  }, [chatMessagesById]);

  // Add a new chat
  const createNewChat = useCallback(() => {
    const baseTitle = "New Chat";
    let count = 1;
    let title = baseTitle;

    while (chatHistory.some((c: any) => c.title === title)) {
      count += 1;
      title = `${baseTitle} ${count}`;
    }
    addChatHistory(title);
    const updated = getChatHistory();

    setChatHistory(updated);
    setSelectedChat(title);
    const newChat = updated.find((c: any) => c.title === title);

    setSelectedChatId(newChat?.id);
    setChatMessagesById((prev: any) => ({ ...prev, [newChat?.id]: [] }));
  }, [chatHistory]);

  // Send a message
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !selectedChatId) return;
      const newMsg = { id: Date.now(), text, sender: "user" };

      setChatMessagesById((prev: any) => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
      }));
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessagesById((prev: any) => ({
          ...prev,
          [selectedChatId]: [
            ...(prev[selectedChatId] || []),
            {
              id: Date.now() + 1,
              text: "Ini jawaban statis dari Fin-AI.",
              sender: "bot",
            },
          ],
        }));
      }, 1200);
    },
    [selectedChatId],
  );

  // Rename chat
  const renameChat = useCallback((id: any, newTitle: string) => {
    renameChatHistory(id, newTitle);
    setChatHistory(getChatHistory());
  }, []);

  // Delete chat
  const deleteChat = useCallback((id: any) => {
    deleteChatHistory(id);
    setChatHistory(getChatHistory());
  }, []);

  // Archive chat
  const archiveChat = useCallback((id: any) => {
    archiveChatHistory(id);
    setChatHistory(getChatHistory());
  }, []);

  return {
    chatHistory,
    chatMessagesById,
    setChatMessagesById,
    selectedChat,
    setSelectedChat,
    selectedChatId,
    setSelectedChatId,
    isTyping,
    setIsTyping,
    createNewChat,
    sendMessage,
    renameChat,
    deleteChat,
    archiveChat,
  };
}
