import React from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${isUser ? "bg-primary text-primary-foreground" : "bg-content2"}`}
      >
        {message.text}
      </div>
    </div>
  );
};
