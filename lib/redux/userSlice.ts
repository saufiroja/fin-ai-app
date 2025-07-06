import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { User } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export const getUserMe = createAsyncThunk(
  "user/getUserMe",
  async (token: string, { rejectWithValue }) => {
    try {
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
      return rejectWithValue({
        message: error.message || "Failed to fetch user data",
      });
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
      return rejectWithValue({
        message: error.message || "Failed to update profile",
      });
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
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMe.fulfilled, (state, action) => {
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
