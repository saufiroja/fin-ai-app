import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { AuthState } from "@/types";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Mock user data
const MOCK_USERS = [
  {
    id: 1,
    name: "Andi Pratama",
    full_name: "Andi Pratama Kusuma",
    email: "andi@example.com",
    password: "password123",
    avatar: "A",
  },
  {
    id: 2,
    name: "Budi Santoso",
    full_name: "Budi Santoso Rahman",
    email: "budi@example.com",
    password: "password123",
    avatar: "B",
  },
  {
    id: 3,
    name: "Citra Dewi",
    full_name: "Citra Dewi Maharani",
    email: "citra@example.com",
    password: "password123",
    avatar: "C",
  },
];

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      // Try to connect to real API first
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }
      Cookies.set("access_token", data.data.access_token);

      return data;
    } catch (error: any) {
      // If API is not available, use mock authentication
      console.log("API not available, using mock authentication");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find mock user
      const mockUser = MOCK_USERS.find(
        (user) =>
          user.email === credentials.email &&
          user.password === credentials.password,
      );

      if (!mockUser) {
        return rejectWithValue({
          message: "Invalid email or password",
          status: 401,
        });
      }

      // Generate mock token
      const mockToken = `mock_token_${mockUser.id}_${Date.now()}`;

      Cookies.set("access_token", mockToken);

      // Return mock response in the same format as real API
      return {
        message: "Login successful",
        data: {
          access_token: mockToken,
        },
        user: {
          id: mockUser.id,
          name: mockUser.name,
          full_name: mockUser.full_name,
          email: mockUser.email,
          avatar: mockUser.avatar,
        },
      };
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userInfo: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: Cookies.get("access_token") || null,
    loading: false,
    error: null as string | null,
    registrationSuccess: false,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("access_token");
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.data.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.registrationSuccess = false;
      });
  },
});

export const { logout, resetRegistrationSuccess, clearError } =
  authSlice.actions;
export default authSlice.reducer;
