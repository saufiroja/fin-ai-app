// Utility for chat history using localStorage
export function getChatHistory() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("chatHistory");

  return data ? JSON.parse(data) : [];
}

export function addChatHistory(title: string) {
  if (typeof window === "undefined") return;
  const history = getChatHistory();
  const newId = history.length > 0 ? history[history.length - 1].id + 1 : 1;
  const newEntry = { id: newId, title };

  localStorage.setItem("chatHistory", JSON.stringify([...history, newEntry]));
}

export function deleteChatHistory(id: number) {
  if (typeof window === "undefined") return;
  const history = getChatHistory();
  const filtered = history.filter((c: any) => c.id !== id);

  localStorage.setItem("chatHistory", JSON.stringify(filtered));
}

export function renameChatHistory(id: number, newTitle: string) {
  if (typeof window === "undefined") return;
  const history = getChatHistory();
  const updated = history.map((c: any) =>
    c.id === id ? { ...c, title: newTitle } : c,
  );

  localStorage.setItem("chatHistory", JSON.stringify(updated));
}

export function archiveChatHistory(id: number) {
  if (typeof window === "undefined") return;
  const history = getChatHistory();
  const updated = history.map((c: any) =>
    c.id === id ? { ...c, archived: true } : c,
  );

  localStorage.setItem("chatHistory", JSON.stringify(updated));
}
