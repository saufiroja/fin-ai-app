import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_BASE_URL = "http://103.183.74.179:8080/api/v1";

// Types
export interface ChatSession {
  id: string;
  chat_session_id?: string;
  user_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  archived?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot" | "ai";
  timestamp: string;
}

interface ChatState {
  sessions: ChatSession[];
  messages: Record<string, ChatMessage[]>;
  selectedSessionId: string | null;
  selectedSession: ChatSession | null;
  loading: boolean;
  error: string | null;
  isTyping: boolean;
}

// Mock chat data
const MOCK_SESSIONS: ChatSession[] = [
  {
    id: "1",
    title: "Investment Planning",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
    archived: false,
  },
  {
    id: "2",
    title: "Budget Analysis",
    created_at: "2024-01-02T10:00:00Z",
    updated_at: "2024-01-02T10:00:00Z",
    archived: false,
  },
  {
    id: "3",
    title: "Tax Planning",
    created_at: "2024-01-03T10:00:00Z",
    updated_at: "2024-01-03T10:00:00Z",
    archived: false,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "msg1",
      text: "Hello! I'd like help with investment planning.",
      sender: "user",
      timestamp: "2024-01-01T10:00:00Z",
    },
    {
      id: "msg2",
      text: "I'd be happy to help you with investment planning! What's your current financial situation and investment goals?",
      sender: "bot",
      timestamp: "2024-01-01T10:01:00Z",
    },
  ],
  "2": [
    {
      id: "msg3",
      text: "Can you help me analyze my monthly budget?",
      sender: "user",
      timestamp: "2024-01-02T10:00:00Z",
    },
    {
      id: "msg4",
      text: "Of course! Please share your monthly income and expenses so I can help you analyze your budget.",
      sender: "bot",
      timestamp: "2024-01-02T10:01:00Z",
    },
  ],
};

const initialState: ChatState = {
  sessions: [],
  messages: {},
  selectedSessionId: null,
  selectedSession: null,
  loading: false,
  error: null,
  isTyping: false,
};

// Async thunks for API calls
export const createChatSession = createAsyncThunk(
  "chat/createSession",
  async (
    { token, title = "New Chat" }: { token: string; title?: string },
    { rejectWithValue },
  ) => {
    try {
      // Try to connect to real API first
      const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      const apiResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(apiResponse);
      }

      // Transform API response to match our interface
      const transformedSession = {
        id: apiResponse.data.chat_session_id,
        chat_session_id: apiResponse.data.chat_session_id,
        user_id: apiResponse.data.user_id,
        title: apiResponse.data.title,
        created_at: apiResponse.data.created_at,
        updated_at: apiResponse.data.updated_at,
        deleted_at: apiResponse.data.deleted_at,
        archived: false,
      };

      return transformedSession;
    } catch (error: any) {
      // If API is not available, use mock data
      console.log("API not available, using mock chat sessions");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create mock session
      const mockSession: ChatSession = {
        id: Date.now().toString(),
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        archived: false,
      };

      return mockSession;
    }
  },
);

export const fetchChatSessions = createAsyncThunk(
  "chat/fetchSessions",
  async (token: string, { rejectWithValue }) => {
    try {
      // Try to connect to real API first
      const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const apiResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(apiResponse);
      }

      // Transform API response to match our interface
      const transformedSessions = apiResponse.data.map((session: any) => ({
        id: session.chat_session_id,
        chat_session_id: session.chat_session_id,
        user_id: session.user_id,
        title: session.title,
        created_at: session.created_at,
        updated_at: session.updated_at,
        deleted_at: session.deleted_at,
        archived: false,
      }));

      return transformedSessions;
    } catch (error: any) {
      // If API is not available, use mock data
      console.log("API not available, using mock chat sessions");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return MOCK_SESSIONS;
    }
  },
);

export const renameChatSession = createAsyncThunk(
  "chat/renameSession",
  async (
    {
      token,
      sessionId,
      newTitle,
    }: { token: string; sessionId: string; newTitle: string },
    { rejectWithValue },
  ) => {
    try {
      // Try to connect to real API first
      const response = await fetch(
        `${API_BASE_URL}/chat/sessions/rename/${sessionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newTitle }),
        },
      );
      const apiResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(apiResponse);
      }

      // Return the updated session data
      return {
        sessionId,
        newTitle,
        updatedSession: apiResponse.data
          ? {
              id: apiResponse.data.chat_session_id,
              chat_session_id: apiResponse.data.chat_session_id,
              user_id: apiResponse.data.user_id,
              title: apiResponse.data.title,
              created_at: apiResponse.data.created_at,
              updated_at: apiResponse.data.updated_at,
              deleted_at: apiResponse.data.deleted_at,
              archived: false,
            }
          : null,
      };
    } catch (error: any) {
      // If API is not available, use mock data
      console.log("API not available, using mock rename");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { sessionId, newTitle, updatedSession: null };
    }
  },
);

export const deleteChatSession = createAsyncThunk(
  "chat/deleteSession",
  async (
    { token, sessionId }: { token: string; sessionId: string },
    { rejectWithValue },
  ) => {
    try {
      // Try to connect to real API first
      const response = await fetch(
        `${API_BASE_URL}/chat/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();

        return rejectWithValue(data);
      }

      return sessionId;
    } catch (error: any) {
      // If API is not available, use mock deletion
      console.log("API not available, using mock deletion");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return sessionId;
    }
  },
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    {
      token,
      chatSessionId,
      message,
      modelId = "01JW320X5V1N7QQS2YAFC6FS71",
      mode = "ask",
    }: {
      token: string;
      chatSessionId: string;
      message: string;
      modelId?: string;
      mode?: "ask" | "agent";
    },
    { rejectWithValue },
  ) => {
    console.log("SendChatMessage called with:", {
      chatSessionId,
      message: message.substring(0, 50) + "...",
      mode,
      hasToken: !!token,
    });

    try {
      // Try to connect to real API first
      const requestBody = {
        chat_session_id: chatSessionId,
        model_id: modelId,
        mode: mode,
        message: message,
      };

      console.log("API Request body:", requestBody);

      const response = await fetch(`${API_BASE_URL}/chat/sessions/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("API Response status:", response.status);
      const apiResponse = await response.json();

      console.log("API Response:", apiResponse);

      if (!response.ok) {
        console.error("API Error:", apiResponse);

        return rejectWithValue(apiResponse);
      }

      // Transform API response to match our interface
      const conversation = apiResponse.data.conversation || [];
      const transformedMessages: ChatMessage[] = conversation.map(
        (msg: any, index: number) => ({
          id: `${apiResponse.data.chat_message_id}_${index}`,
          text: msg.text,
          sender: msg.sender === "ai" ? "bot" : msg.sender,
          timestamp: apiResponse.data.created_at,
        }),
      );

      return {
        sessionId: chatSessionId,
        messages: transformedMessages,
        messageId: apiResponse.data.chat_message_id,
      };
    } catch (error: any) {
      // If API is not available, use mock response
      console.log("API error occurred:", error.message);
      console.log("Using mock chat response as fallback");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create mock response
      const mockMessages: ChatMessage[] = [
        {
          id: `user_${Date.now()}`,
          text: message,
          sender: "user",
          timestamp: new Date().toISOString(),
        },
        {
          id: `bot_${Date.now()}`,
          text: `I understand you're asking about: "${message}". This is a simulated response. Please connect to a real AI service for actual financial advice.`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ];

      console.log("Mock response created:", mockMessages);

      return {
        sessionId: chatSessionId,
        messages: mockMessages,
        messageId: `mock_${Date.now()}`,
      };
    }
  },
);

export const fetchChatSessionDetails = createAsyncThunk(
  "chat/fetchSessionDetails",
  async (
    { token, sessionId }: { token: string; sessionId: string },
    { rejectWithValue },
  ) => {
    try {
      // Try to connect to real API first
      const response = await fetch(
        `${API_BASE_URL}/chat/sessions/${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const apiResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(apiResponse);
      }

      // Transform API response to match our interface
      const messages: ChatMessage[] = apiResponse.data.map((msg: any) => ({
        id: msg.chat_message_id,
        text: msg.message,
        sender: msg.sender === "ai" ? "bot" : msg.sender,
        timestamp: msg.created_at,
      }));

      return {
        sessionId,
        messages,
      };
    } catch (error: any) {
      // If API is not available, check localStorage first
      console.log("API not available, using stored messages");

      // Return empty messages or stored messages
      return {
        sessionId,
        messages: [], // Will fall back to localStorage in the component
      };
    }
  },
);

// Chat slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;

      state.selectedSessionId = sessionId;
      state.selectedSession =
        state.sessions.find((s) => s.id === sessionId) || null;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("lastSelectedChatId", sessionId);
      }
    },

    addMessage: (
      state,
      action: PayloadAction<{
        sessionId: string;
        message: Omit<ChatMessage, "id" | "timestamp">;
      }>,
    ) => {
      const { sessionId, message } = action.payload;
      const newMessage: ChatMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };

      if (!state.messages[sessionId]) {
        state.messages[sessionId] = [];
      }
      state.messages[sessionId].push(newMessage);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "chatMessagesById",
          JSON.stringify(state.messages),
        );
      }
    },

    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    archiveSession: (state, action: PayloadAction<string>) => {
      const sessionId = action.payload;
      const session = state.sessions.find((s) => s.id === sessionId);

      if (session) {
        session.archived = true;
      }
    },

    loadMessagesFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("chatMessagesById");

        if (stored) {
          state.messages = JSON.parse(stored);
        }

        // Load mock messages if no stored messages
        if (Object.keys(state.messages).length === 0) {
          state.messages = MOCK_MESSAGES;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create session
      .addCase(createChatSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatSession.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new session at the beginning of the array for recent-first display
        state.sessions.unshift(action.payload);
        state.selectedSessionId = action.payload.id;
        state.selectedSession = action.payload;

        // Initialize empty messages for new session
        state.messages[action.payload.id] = [];

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("lastSelectedChatId", action.payload.id);
          localStorage.setItem(
            "chatMessagesById",
            JSON.stringify(state.messages),
          );
        }
      })
      .addCase(createChatSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch sessions
      .addCase(fetchChatSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatSessions.fulfilled, (state, action) => {
        state.loading = false;
        // Sort sessions by updated_at descending (newest first)
        const sortedSessions = action.payload.sort(
          (a: ChatSession, b: ChatSession) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        );

        state.sessions = sortedSessions;

        // Set last selected session from localStorage
        if (typeof window !== "undefined") {
          const lastId = localStorage.getItem("lastSelectedChatId");

          if (lastId && state.sessions.some((s) => s.id === lastId)) {
            state.selectedSessionId = lastId;
            state.selectedSession =
              state.sessions.find((s) => s.id === lastId) || null;
          }
        }
      })
      .addCase(fetchChatSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Rename session
      .addCase(renameChatSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renameChatSession.fulfilled, (state, action) => {
        state.loading = false;
        const { sessionId, newTitle } = action.payload;
        const session = state.sessions.find((s) => s.id === sessionId);

        if (session) {
          session.title = newTitle;
          session.updated_at = new Date().toISOString();
        }
        if (state.selectedSession && state.selectedSession.id === sessionId) {
          state.selectedSession.title = newTitle;
        }
      })
      .addCase(renameChatSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete session
      .addCase(deleteChatSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChatSession.fulfilled, (state, action) => {
        state.loading = false;
        const sessionId = action.payload;

        state.sessions = state.sessions.filter((s) => s.id !== sessionId);

        // Clear messages for deleted session
        delete state.messages[sessionId];

        // Clear selection if deleted session was selected
        if (state.selectedSessionId === sessionId) {
          state.selectedSessionId = null;
          state.selectedSession = null;

          if (typeof window !== "undefined") {
            localStorage.removeItem("lastSelectedChatId");
          }
        }

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "chatMessagesById",
            JSON.stringify(state.messages),
          );
        }
      })
      .addCase(deleteChatSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(sendChatMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchChatSessionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatSessionDetails.fulfilled, (state, action) => {
        state.loading = false;
        const { sessionId, messages } = action.payload;

        state.messages[sessionId] = messages;

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "chatMessagesById",
            JSON.stringify(state.messages),
          );
        }
      })
      .addCase(fetchChatSessionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedSession,
  addMessage,
  setTyping,
  clearError,
  archiveSession,
  loadMessagesFromStorage,
} = chatSlice.actions;

export default chatSlice.reducer;
