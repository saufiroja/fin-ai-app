"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Form } from "@heroui/form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Icon } from "@iconify/react";
import { Search } from "lucide-react";

import Loading from "./loading";

import { ChatMessage } from "@/components/chat-message";
import SparkleIcon from "@/components/sparkle-icon";
import { suggestedPrompts } from "@/dummy/suggestedPrompts";
import { RootState, AppDispatch } from "@/lib/redux/store";
import {
  fetchChatSessions,
  createChatSession,
  renameChatSession,
  deleteChatSession,
  archiveSession,
  setSelectedSession,
  addMessage,
  setTyping,
  clearError,
  loadMessagesFromStorage,
  sendChatMessage,
  fetchChatSessionDetails,
} from "@/lib/redux/chatSlice";

const actions = [
  {
    key: "rename",
    label: "Rename chat",
    icon: "lucide:edit-2",
    color: "primary",
  },
  {
    key: "archive",
    label: "Archive chat",
    icon: "lucide:archive",
    color: "secondary",
  },
  {
    key: "delete",
    label: "Delete chat",
    icon: "lucide:trash-2",
    color: "danger",
  },
];

export default function ChatPage() {
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const {
    sessions: chatHistory,
    messages: chatMessagesById,
    selectedSessionId,
    error,
    isTyping,
  } = useSelector((state: RootState) => state.chat);

  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isFetchingSessionDetails, setIsFetchingSessionDetails] =
    useState(false);

  // Modal state
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renamingChat, setRenamingChat] = useState<any>(null);
  const [renameValue, setRenameValue] = useState("");

  // Initialize chat data
  useEffect(() => {
    const initializeChat = async () => {
      dispatch(loadMessagesFromStorage());
      if (token) {
        await dispatch(fetchChatSessions(token));

        // If there's a last selected session, fetch its details
        if (typeof window !== "undefined") {
          const lastId = localStorage.getItem("lastSelectedChatId");

          if (lastId) {
            setIsFetchingSessionDetails(true);
            try {
              await dispatch(
                fetchChatSessionDetails({ token, sessionId: lastId }),
              );
            } catch (error) {
              // Handle error silently or show user-friendly message
              // Could be replaced with toast notification
            } finally {
              setIsFetchingSessionDetails(false);
            }
          }
        }
      } else {
        // If no token, we can still load from localStorage or show empty state
        // Handle no token state gracefully
      }
      setIsInitialLoading(false);
    };

    initializeChat();
  }, [dispatch, token]);

  // Show error notification
  useEffect(() => {
    if (error) {
      // Handle error properly - could be replaced with toast notification
      // For now, we'll clear the error silently
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && !isSendingMessage && token) {
      let sessionId = selectedSessionId;

      // If no session is selected, create a new one first
      if (!sessionId) {
        setIsCreatingSession(true);
        try {
          const result = await dispatch(
            createChatSession({ token, title: "New Chat" }),
          );

          if (createChatSession.fulfilled.match(result)) {
            // Get the session ID from the created session
            sessionId = result.payload.id;
          } else {
            // Handle failed session creation
            setIsCreatingSession(false);

            return;
          }
        } catch (error) {
          // Handle error creating new chat
          setIsCreatingSession(false);

          return;
        }
        setIsCreatingSession(false);
      }

      // Make sure we have a valid session ID
      if (!sessionId) {
        // Handle missing session ID
        return;
      }

      setIsSendingMessage(true);

      try {
        const userMessage = newMessage;

        setNewMessage("");

        // Immediately add the user message to the chat
        dispatch(
          addMessage({
            sessionId,
            message: {
              text: userMessage,
              sender: "user",
            },
          }),
        );

        // Show typing indicator
        dispatch(setTyping(true));

        // Send message using the API
        const result = await dispatch(
          sendChatMessage({
            token,
            chatSessionId: sessionId,
            message: userMessage,
            mode: "ask", // or "agent" depending on your needs
          }),
        );

        // Check if the message was sent successfully
        if (sendChatMessage.fulfilled.match(result)) {
          // After successful send, fetch the latest session details to get updated messages
          setIsFetchingSessionDetails(true);
          try {
            await dispatch(fetchChatSessionDetails({ token, sessionId }));
          } catch (error) {
            // Handle error refreshing session details
          } finally {
            setIsFetchingSessionDetails(false);
            dispatch(setTyping(false)); // Stop typing indicator after fetching
          }
        } else {
          // Handle failed message send
          dispatch(setTyping(false)); // Stop typing indicator on error
        }
      } catch (error) {
        // Handle error sending message
        dispatch(setTyping(false)); // Stop typing indicator on error
      } finally {
        setIsSendingMessage(false);
      }
    }
  };

  const handleNewChat = async () => {
    if (token) {
      setIsCreatingSession(true);
      try {
        const result = await dispatch(
          createChatSession({ token, title: "New Chat" }),
        );

        // Check if the session was created successfully
        if (createChatSession.fulfilled.match(result)) {
          // Handle successful session creation
        } else {
          // Handle failed session creation
        }
      } catch (error) {
        // Handle error creating new chat
      } finally {
        setIsCreatingSession(false);
      }
    }
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRenameClick = (chat: any) => {
    setRenamingChat(chat);
    setRenameValue(chat.title);
    setIsRenameModalOpen(true);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      renameValue.trim() &&
      renameValue !== renamingChat?.title &&
      renamingChat &&
      token
    ) {
      await dispatch(
        renameChatSession({
          token,
          sessionId: renamingChat.id,
          newTitle: renameValue.trim(),
        }),
      );
    }
    setIsRenameModalOpen(false);
    setRenamingChat(null);
    setRenameValue("");
  };

  const handleRenameCancel = () => {
    setIsRenameModalOpen(false);
    setRenamingChat(null);
    setRenameValue("");
  };

  const handleChatSelect = async (chatId: string) => {
    dispatch(setSelectedSession(chatId));
    setSidebarOpen(false);

    if (token) {
      setIsFetchingSessionDetails(true);
      try {
        await dispatch(fetchChatSessionDetails({ token, sessionId: chatId }));
      } catch (error) {
        // Handle error fetching session details
      } finally {
        setIsFetchingSessionDetails(false);
      }
    }
  };

  const handleArchiveChat = (chatId: string) => {
    dispatch(archiveSession(chatId));
  };

  const handleDeleteChat = (chatId: string) => {
    if (token) {
      dispatch(deleteChatSession({ token, sessionId: chatId }));
    }
  };

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] md:h-[calc(93vh-2rem)] bg-gradient-to-br from-background to-content1 rounded-none md:rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/50 z-30 md:hidden cursor-pointer"
          type="button"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Rename Modal */}
      <Modal
        backdrop="blur"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isOpen={isRenameModalOpen}
        placement="center"
        onClose={handleRenameCancel}
      >
        <ModalContent>
          {(onClose) => (
            <Form onSubmit={handleRenameSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon className="text-primary" icon="lucide:edit-2" />
                  <span>Rename Chat</span>
                </div>
              </ModalHeader>
              <ModalBody className="w-full">
                <Input
                  className="w-full"
                  classNames={{
                    inputWrapper:
                      "w-full border-primary/40 focus-within:border-primary",
                  }}
                  label="Chat Name"
                  placeholder="Enter new chat name"
                  startContent={
                    <Icon
                      className="text-default-400"
                      icon="lucide:message-square"
                    />
                  }
                  value={renameValue}
                  variant="bordered"
                  onValueChange={setRenameValue}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleRenameCancel}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isDisabled={
                    !renameValue.trim() || renameValue === renamingChat?.title
                  }
                  type="submit"
                >
                  Rename
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>

      {/* Enhanced Sidebar */}
      <Card
        className={`
        w-80 bg-content1/80 backdrop-blur-xl shadow-none rounded-none z-50 flex flex-col
        fixed md:relative inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:w-80 md:block
      `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section - Fixed */}
        <CardHeader className="pb-4 flex-shrink-0">
          <div className="flex flex-col w-full gap-4">
            {/* Brand Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Icon
                  className="text-primary-foreground text-xl"
                  icon="lucide:briefcase"
                />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Fin-AI
                </h1>
                <p className="text-xs text-default-500">
                  Smart Financial Assistant
                </p>
              </div>
            </div>

            {/* Search Input */}
            <Input
              isClearable
              classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focus=true]:bg-default-200/50",
                  "dark:group-data-[focus=true]:bg-default/60",
                  "!cursor-text",
                ],
              }}
              placeholder="Search conversations..."
              startContent={<Search className="text-gray-400 w-5 h-5" />}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            {/* New Chat Button */}
            <Button
              className="w-full justify-start font-semibold bg-gradient-to-r from-primary to-secondary"
              color="primary"
              isLoading={isCreatingSession}
              radius="lg"
              size="md"
              startContent={
                !isCreatingSession && <Icon icon="lucide:message-square" />
              }
              variant="shadow"
              onPress={handleNewChat}
            >
              {isCreatingSession ? "Creating..." : "New Conversation"}
            </Button>
          </div>
        </CardHeader>

        {/* Chat History - Scrollable */}
        <CardBody className="pt-0 flex-1 overflow-hidden flex flex-col">
          <div className="flex flex-col h-full">
            {/* Recent Conversations Label */}
            <p className="text-sm font-medium text-default-600 tracking-wide mb-3 px-1 flex-shrink-0">
              Recent Chats
            </p>

            {/* Scrollable Chat List */}
            <div className="flex-1 overflow-hidden">
              <ScrollShadow
                hideScrollBar
                className="overflow-y-auto w-[300px] h-[600px]"
              >
                <div className="space-y-2">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-default-500 text-sm py-4">
                      No conversations yet. Start a new one!
                    </div>
                  ) : (
                    chatHistory
                      .filter((chat: any) =>
                        chat.title.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((chat: any) => (
                        <div key={chat.id} className="relative group">
                          <div
                            className={`w-full transition-all duration-200 hover:bg-content2/80 hover:shadow-lg shadow-none rounded-md cursor-pointer text-left py-2 px-4 relative
                            ${
                              selectedSessionId === chat.id
                                ? "bg-primary/20 border-l-4 border-primary"
                                : "bg-content2/50"
                            }`}
                            role="button"
                            onClick={() => {
                              handleChatSelect(chat.id);
                              setTimeout(() => {
                                const textarea = document.querySelector(
                                  'textarea[placeholder="Ask me anything about finance..."]',
                                ) as HTMLTextAreaElement;

                                if (textarea) textarea.focus();
                              }, 200);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 w-full">
                                <div className="w-full flex items-center gap-2">
                                  <h4 className="text-sm font-medium truncate max-w-full block">
                                    {chat.title}
                                  </h4>
                                  {chat.archived && (
                                    <span className="text-xs text-warning-600 bg-warning-100 rounded px-2 py-0.5 ml-1">
                                      Archived
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Action Dropdown positioned outside the clickable area */}
                          <div
                            className="absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                            role="button"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Dropdown placement="bottom-end">
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  aria-label="Open chat actions"
                                  className="min-w-6 w-6 h-6 bg-content1/80 backdrop-blur-sm rounded-full flex items-center justify-center"
                                  size="sm"
                                  variant="light"
                                >
                                  <Icon
                                    className="text-xs"
                                    icon="lucide:more-horizontal"
                                  />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                closeOnSelect
                                aria-label="Chat actions"
                                className="bg-content1/95 rounded-lg p-1 min-w-[140px] border border-divider/20 block md:absolute md:left-0 md:top-full"
                                items={actions}
                                onAction={async (key) => {
                                  if (key === "delete") {
                                    handleDeleteChat(chat.id);
                                  } else if (key === "rename") {
                                    handleRenameClick(chat);
                                  } else if (key === "archive") {
                                    handleArchiveChat(chat.id);
                                  }
                                }}
                              >
                                {actions.map((action) => (
                                  <DropdownItem
                                    key={action.key}
                                    className={`text-sm text-${action.color}-600 hover:bg-${action.color}-100`}
                                    startContent={
                                      <Icon icon={`${action.icon}`} />
                                    }
                                  >
                                    {action.label}
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollShadow>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Main Chat Area */}
      <div
        className="flex-1 flex flex-col bg-content1/30 backdrop-blur-xl w-full relative cursor-pointer"
        role="button"
        onClick={() => {
          if (sidebarOpen) {
            setSidebarOpen(false);
          }
        }}
      >
        {/* Fixed Header */}
        <div className="sticky top-0 z-30 bg-content1/80 backdrop-blur-xl w-full">
          {/* Enhanced Chat Header */}
          <div className="py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Mobile Menu Button */}
              <Button
                isIconOnly
                className="md:hidden"
                radius="full"
                size="sm"
                variant="light"
                onPress={toggleSidebar}
              >
                <Icon className="text-lg" icon="lucide:menu" />
              </Button>
            </div>
          </div>
        </div>
        {/* Messages Area */}
        <ScrollShadow
          hideScrollBar
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-content2/50 backdrop-blur-sm"
        >
          {((selectedSessionId &&
            chatMessagesById[selectedSessionId]?.length) ||
            0) === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-4">
              <div className="relative mb-6 md:mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-divider/30 shadow-2xl">
                  <Icon
                    className="text-primary text-3xl md:text-4xl"
                    icon="lucide:briefcase"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                  <SparkleIcon />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to Fin-AI
              </h3>
              <p className="text-default-500 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                Your intelligent financial assistant. Ask me anything about
                budgeting, investments, or financial planning. I&apos;m here to
                help you make informed decisions and manage your finances
                effectively.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
                {suggestedPrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    isPressable
                    className="p-3 md:p-4 hover:scale-105 transition-all duration-200 bg-content2/50 backdrop-blur-sm border-divider/30"
                    isDisabled={isSendingMessage || isCreatingSession}
                    radius="lg"
                    onPress={() => {
                      if (!isSendingMessage && !isCreatingSession) {
                        setNewMessage(prompt.text);
                        setTimeout(() => {
                          handleSendMessage();
                        }, 100);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 bg-${prompt.color}/20 rounded-xl flex items-center justify-center`}
                      >
                        <Icon
                          className={`text-${prompt.color} text-base md:text-lg`}
                          icon={prompt.icon}
                        />
                      </div>
                      <span className="font-medium text-sm md:text-base">
                        {prompt.text}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto w-full">
              {selectedSessionId &&
                chatMessagesById[selectedSessionId]?.map((message: any) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              {(isTyping || isFetchingSessionDetails) && (
                <div className="flex items-center gap-3 px-2 md:px-4">
                  <Avatar
                    className="bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                    name="Fin-AI"
                    size="md"
                  >
                    <Icon className="text-lg" icon="lucide:robot" />
                  </Avatar>
                  <span className="text-sm text-default-500">
                    {isTyping && "Fin-AI is thinking..."}
                    {!isTyping &&
                      isFetchingSessionDetails &&
                      "Loading messages..."}
                  </span>
                </div>
              )}
            </div>
          )}
        </ScrollShadow>
        {/* Enhanced Input Area */}
        <Card className="shadow-none rounded-none bg-content1/50">
          <CardBody className="p-3 md:p-4">
            <Textarea
              classNames={{
                inputWrapper:
                  "border-2 border-primary/40 bg-content2/70 backdrop-blur-md hover:bg-content2/90 transition-all shadow-md min-h-[50px]",
                input:
                  "text-base md:text-md font-medium placeholder:font-normal resize-none",
              }}
              endContent={
                <Button
                  isIconOnly
                  aria-label="Send message"
                  className="rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 duration-150 bg-gradient-to-r from-primary to-secondary"
                  color="primary"
                  isDisabled={
                    isSendingMessage || isCreatingSession || !newMessage.trim()
                  }
                  isLoading={isSendingMessage || isCreatingSession}
                  size="sm"
                  type="submit"
                  variant="solid"
                  onPress={handleSendMessage}
                >
                  {!isSendingMessage && (
                    <Icon className="text-sm" icon="lucide:send" />
                  )}
                </Button>
              }
              isDisabled={isSendingMessage || isCreatingSession}
              maxRows={4}
              minRows={1}
              placeholder="Ask me anything about finance..."
              radius="md"
              startContent={
                <div className="flex items-center justify-center w-4 h-4 rounded-full">
                  <SparkleIcon />
                </div>
              }
              value={newMessage}
              variant="bordered"
              onKeyDown={(e: any) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !isSendingMessage &&
                  !isCreatingSession
                ) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onValueChange={setNewMessage}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
