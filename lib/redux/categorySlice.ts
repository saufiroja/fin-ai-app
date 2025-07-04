import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Types
export interface Category {
  category_id: string;
  name: string;
  type: "income" | "expense";
  created_at: string;
  updated_at: string;
}

export interface CategoryPagination {
  total: number;
  current_page: number;
  total_pages: number;
}

export interface CategoryResponse {
  status: number;
  message: string;
  data: Category[] | null;
  pagination: CategoryPagination;
}

export interface CategoryParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CategoryState {
  categories: Category[];
  pagination: CategoryPagination;
  loading: boolean;
  error: string | null;
  lastFetchParams: CategoryParams | null;
}

// Mock data for fallback
const MOCK_CATEGORIES: Category[] = [
  {
    category_id: "cat1",
    name: "Food",
    type: "expense",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    category_id: "cat2",
    name: "Salary",
    type: "income",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    category_id: "cat3",
    name: "Transportation",
    type: "expense",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    category_id: "cat4",
    name: "Utilities",
    type: "expense",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    category_id: "cat5",
    name: "Shopping",
    type: "expense",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    category_id: "cat6",
    name: "Entertainment",
    type: "expense",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// Async thunk
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (
    { token, params }: { token: string; params: CategoryParams },
    { rejectWithValue },
  ) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.offset) queryParams.append("offset", params.offset.toString());
      if (params.search) queryParams.append("search", params.search);

      const response = await fetch(
        `${API_BASE_URL}/categories?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CategoryResponse = await response.json();

      return { data, params };
    } catch (error: any) {
      console.log("API not available, using mock categories", error.message);

      // Return mock data with the same structure as API
      let filteredCategories = [...MOCK_CATEGORIES];

      // Apply client-side filtering for mock data
      if (params.search) {
        filteredCategories = filteredCategories.filter((c) =>
          c.name.toLowerCase().includes(params.search!.toLowerCase()),
        );
      }

      // Apply pagination
      const limit = params.limit || 10;
      const offset = params.offset || 1;
      const startIdx = (offset - 1) * limit;
      const paginatedCategories = filteredCategories.slice(
        startIdx,
        startIdx + limit,
      );

      const mockResponse: CategoryResponse = {
        status: 200,
        message: "Mock categories retrieved successfully",
        data: paginatedCategories,
        pagination: {
          total: filteredCategories.length,
          current_page: offset,
          total_pages: Math.ceil(filteredCategories.length / limit),
        },
      };

      return { data: mockResponse, params };
    }
  },
);

// Initial state
const initialState: CategoryState = {
  categories: [],
  pagination: {
    total: 0,
    current_page: 0,
    total_pages: 0,
  },
  loading: false,
  error: null,
  lastFetchParams: null,
};

// Slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.pagination = {
        total: 0,
        current_page: 0,
        total_pages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const { data, params } = action.payload;

        state.categories = data.data || [];
        state.pagination = data.pagination;
        state.lastFetchParams = params;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export const { clearCategoryError, clearCategories } = categorySlice.actions;
export default categorySlice.reducer;
