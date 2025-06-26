import React from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export const useChatMessages = () => {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          text: "Thanks for your message! I'm a demo bot.",
          sender: "bot",
        },
      ]);
    }, 1000);
  };

  return { messages, addMessage };
};
