"use client";
import { Textarea } from "@heroui/input";
import React from "react";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Form } from "@heroui/form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import SparkleIcon from "@/components/sparkle-icon";
import { PhotoUpload } from "@/components/photo-upload";
import { useChatMessages } from "@/hooks/use-chat-message";
import { subtitle } from "@/components/primitives";

export default function Home() {
  // Simulate user login (replace with real user context if available)
  const user = { name: "Andi" };
  const subtitles = [
    "AI-powered financial analysis and insights for smarter decisions.",
    "Yuk, mulai kelola keuangan dengan lebih cerdas hari ini!",
    "Apa kabar? Siap bantu atur keuanganmu kapan saja.",
    "Setiap langkah kecil menuju finansial sehat itu berarti.",
    "Sudah cek pengeluaran minggu ini? Aku siap bantu!",
    "Jangan lupa sisihkan untuk tabungan, ya!",
    "Mau konsultasi keuangan? Tanyakan saja di sini.",
    "Semangat menabung dan investasi hari ini!",
    "Keuangan sehat, hidup pun tenang.",
    "Yuk, capai tujuan finansialmu bersama FinAI!",
  ];

  const [randomSubtitle, setRandomSubtitle] = React.useState(subtitles[0]);
  const { addMessage } = useChatMessages();
  const [newMessage, setNewMessage] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("chat");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setRandomSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)]);
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() && !isLoading) {
      setIsLoading(true);
      // --- Create a new chat and store message for /chat page ---
      // Get current chat history from localStorage
      const getChatHistory = () => {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem("chatHistory")
            : null;

        return raw ? JSON.parse(raw) : [];
      };
      const addChatHistory = (title: string) => {
        const history = getChatHistory();
        const id = Date.now();
        const newChat = { id, title, archived: false };
        const updated = [...history, newChat];

        localStorage.setItem("chatHistory", JSON.stringify(updated));

        return newChat;
      };
      // Generate unique chat title
      const title = newMessage;
      const newChat = addChatHistory(title);
      // Store the message under the new chat's ID
      const chatMessagesById =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("chatMessagesById") || "{}")
          : {};

      chatMessagesById[newChat.id] = [
        { id: Date.now(), text: newMessage, sender: "user" },
      ];
      localStorage.setItem(
        "chatMessagesById",
        JSON.stringify(chatMessagesById),
      );
      // Store the new chat id for /chat page to auto-select
      localStorage.setItem("pendingChatId", String(newChat.id));
      setNewMessage("");
      setTimeout(() => {
        router.push("/chat");
        setIsLoading(false);
      }, 300);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      animate="visible"
      className="flex flex-col items-center justify-center gap-8 py-12 px-4"
      initial="hidden"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div
        className="flex flex-col items-center gap-6 text-center max-w-2xl"
        variants={itemVariants}
      >
        {/* Logo or Brand */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Icon className="w-8 h-8 text-white" icon="lucide:brain-circuit" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <Icon className="w-3 h-3 text-white" icon="lucide:sparkles" />
          </div>
        </div>

        {/* Personalized Greeting */}
        {user && (
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Halo, {user.name}! 👋
          </motion.div>
        )}

        {/* Dynamic Subtitle */}
        <motion.div
          key={randomSubtitle} // This will trigger re-animation on subtitle change
          animate={{ opacity: 1, y: 0 }}
          className={`${subtitle()} text-lg leading-relaxed text-default-600 dark:text-default-400`}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          variants={itemVariants}
        >
          {randomSubtitle}
        </motion.div>
      </motion.div>

      {/* Main Interaction Card */}
      <motion.div className="w-full max-w-2xl" variants={itemVariants}>
        <Card
          className="backdrop-blur-sm bg-background/80 border border-divider shadow-xl"
          shadow="none"
        >
          <Form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              if (activeTab === "chat") {
                handleSendMessage();
              }
            }}
          >
            {/* Enhanced Tabs */}
            <div className="px-6 pt-6 pb-2">
              <Tabs
                classNames={{
                  tabList:
                    "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-12",
                  tabContent: "group-data-[selected=true]:text-primary",
                }}
                selectedKey={activeTab}
                variant="underlined"
                onSelectionChange={(key) => setActiveTab(String(key))}
              >
                <Tab
                  key="chat"
                  title={
                    <div className="flex items-center gap-2 px-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 group-data-[selected=true]:bg-primary/20 transition-colors">
                        <Icon
                          className="w-4 h-4 text-primary"
                          icon="lucide:message-circle"
                        />
                      </div>
                      <span className="font-medium">Chat dengan AI</span>
                    </div>
                  }
                />
                <Tab
                  key="scan"
                  title={
                    <div className="flex items-center gap-2 px-2">
                      <div className="p-1.5 rounded-lg bg-success/10 group-data-[selected=true]:bg-success/20 transition-colors">
                        <Icon
                          className="w-4 h-4 text-success"
                          icon="lucide:scan-line"
                        />
                      </div>
                      <span className="font-medium">Scan Struk</span>
                    </div>
                  }
                />
              </Tabs>
            </div>

            <CardBody className="p-6">
              {activeTab === "chat" ? (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                      className="h-auto p-4 justify-start"
                      color="primary"
                      startContent={
                        <Icon className="w-5 h-5" icon="lucide:pie-chart" />
                      }
                      variant="flat"
                    >
                      <div className="text-left">
                        <div className="font-medium text-sm">
                          Analisis Keuangan
                        </div>
                        <div className="text-xs opacity-70">
                          Lihat ringkasan pengeluaran
                        </div>
                      </div>
                    </Button>
                    <Button
                      className="h-auto p-4 justify-start"
                      color="success"
                      startContent={
                        <Icon className="w-5 h-5" icon="lucide:target" />
                      }
                      variant="flat"
                    >
                      <div className="text-left">
                        <div className="font-medium text-sm">Tips Menabung</div>
                        <div className="text-xs opacity-70">
                          Saran personal untukmu
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Enhanced Message Input */}
                  <div className="relative">
                    <Textarea
                      classNames={{
                        input: "text-medium",
                        inputWrapper:
                          "bg-default-50 border-2 border-transparent hover:border-primary/20 focus-within:border-primary/40 transition-colors shadow-sm",
                      }}
                      endContent={
                        <div className="flex items-end pb-2">
                          <Button
                            isIconOnly
                            aria-label="Send message"
                            className="rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 duration-200 bg-gradient-to-r from-primary to-secondary min-w-12 h-12"
                            color="primary"
                            isLoading={isLoading}
                            type="submit"
                            variant="solid"
                          >
                            {!isLoading && (
                              <Icon className="w-5 h-5" icon="lucide:send" />
                            )}
                          </Button>
                        </div>
                      }
                      maxRows={6}
                      minRows={3}
                      placeholder="Tanyakan apapun tentang keuanganmu..."
                      startContent={
                        <div className="p-1">
                          <SparkleIcon />
                        </div>
                      }
                      value={newMessage}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      onValueChange={setNewMessage}
                    />
                  </div>

                  {/* Helper Text */}
                  <div className="flex items-center gap-2 text-xs text-default-500 px-1">
                    <Icon className="w-3 h-3" icon="lucide:lightbulb" />
                    <span>
                      Tekan Enter untuk kirim, Shift+Enter untuk baris baru
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col w-full"
                  initial={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PhotoUpload />
                </motion.div>
              )}
            </CardBody>
          </Form>
        </Card>
      </motion.div>
    </motion.section>
  );
}
