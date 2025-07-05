import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { User } from "@/types";

const API_BASE_URL = "https://103.183.74.179:8080/api/v1";

// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    name: "Andi Pratama",
    full_name: "Andi Pratama Kusuma",
    email: "andi@example.com",
    avatar: "A",
  },
  {
    id: 2,
    name: "Budi Santoso",
    full_name: "Budi Santoso Rahman",
    email: "budi@example.com",
    avatar: "B",
  },
  {
    id: 3,
    name: "Citra Dewi",
    full_name: "Citra Dewi Maharani",
    email: "citra@example.com",
    avatar: "C",
  },
];

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export const getUserMe = createAsyncThunk(
  "user/getUserMe",
  async (token: string, { rejectWithValue }) => {
    try {
      // Try to connect to real API first
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error: any) {
      // If API is not available, use mock user data
      console.log("API not available, using mock user data");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let mockUser;

      if (token && token.startsWith("mock_token_")) {
        // Extract user ID from mock token format: mock_token_{userId}_{timestamp}
        const userId = parseInt(token.split("_")[2]);

        mockUser = MOCK_USERS.find((user) => user.id === userId);
      }

      // Fallback to first mock user if token parsing fails
      if (!mockUser) {
        mockUser = MOCK_USERS[0];
      }

      // Return mock response in the same format as real API
      return {
        message: "User data retrieved successfully",
        data: {
          id: mockUser.id,
          full_name: mockUser.full_name,
          name: mockUser.name,
          email: mockUser.email,
          avatar: mockUser.avatar,
        },
      };
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (
    { token, profileData }: { token: string; profileData: Partial<User> },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error: any) {
      // Mock update for development
      console.log("API not available, using mock profile update");

      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        message: "Profile updated successfully",
        data: {
          ...profileData,
          id: 1, // Mock ID
        },
      };
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  } as UserState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Me
      .addCase(getUserMe.pending, (state) => {
        console.log("getUserMe.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMe.fulfilled, (state, action) => {
        console.log("getUserMe.fulfilled", action.payload);
        state.loading = false;
        state.currentUser = {
          id: action.payload.data.id,
          name: action.payload.data.name || action.payload.data.full_name,
          full_name: action.payload.data.full_name,
          email: action.payload.data.email,
          avatar: action.payload.data.avatar,
        };
      })
      .addCase(getUserMe.rejected, (state, action) => {
        console.log("getUserMe.rejected", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload.data,
          };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError, setCurrentUser, clearCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;
