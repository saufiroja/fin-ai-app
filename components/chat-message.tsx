import React from "react";
import ReactMarkdown from "react-markdown";

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
        <div
          className={`prose prose-sm max-w-none ${isUser ? "prose-invert" : "dark:prose-invert"}`}
        >
          <ReactMarkdown
            components={{
              // Customize heading styles
              h1: ({ children }) => (
                <h1 className="text-lg font-bold mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-semibold mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-medium mb-1">{children}</h3>
              ),
              // Customize paragraph styles
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              // Customize list styles
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              // Customize code styles for both user and bot
              code: ({ children, className }) => {
                const isInline = !className;

                return isInline ? (
                  <code
                    className={`px-1 py-0.5 rounded text-sm ${
                      isUser
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {children}
                  </code>
                ) : (
                  <code className={className}>{children}</code>
                );
              },
              pre: ({ children }) => (
                <pre
                  className={`p-3 rounded-md overflow-x-auto text-sm mb-2 ${
                    isUser
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {children}
                </pre>
              ),
              // Customize link styles for both user and bot
              a: ({ children, href }) => (
                <a
                  className={`hover:underline ${
                    isUser
                      ? "text-white/90"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              ),
              // Customize blockquote styles for both user and bot
              blockquote: ({ children }) => (
                <blockquote
                  className={`border-l-4 pl-4 italic mb-2 ${
                    isUser
                      ? "border-white/40 text-white/90"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
