import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Types
export interface Transaction {
  transaction_id: string;
  user_id: string;
  category_id: string;
  type: "expense" | "income";
  description: string;
  amount: number;
  source: string;
  transaction_date: string;
  ai_category_confidence: number;
  is_auto_categorized: boolean;
  created_at: string;
  updated_at: string;
  confirmed: boolean;
  discount: number;
  payment_method: string;
}

export interface TransactionPagination {
  total: number;
  current_page: number;
  total_pages: number;
}

export interface TransactionResponse {
  status: number;
  message: string;
  data: Transaction[] | null;
  pagination: TransactionPagination;
}

export interface OverviewData {
  total_income: string;
  total_expense: string;
  total_transactions: string;
}

export interface OverviewResponse {
  status: number;
  message: string;
  data: OverviewData;
}

export interface TransactionParams {
  limit?: number;
  offset?: number;
  category_id?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface TransactionState {
  transactions: Transaction[];
  pagination: TransactionPagination;
  overview: OverviewData | null;
  loading: boolean;
  overviewLoading: boolean;
  error: string | null;
  overviewError: string | null;
  lastFetchParams: TransactionParams | null;
}

// Mock data for fallback
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    transaction_id: "1",
    user_id: "user1",
    category_id: "cat1",
    type: "expense",
    description: "Makan siang di restoran",
    amount: 50000,
    source: "manual",
    transaction_date: "2024-01-15T12:00:00Z",
    ai_category_confidence: 0.85,
    is_auto_categorized: false,
    created_at: "2024-01-15T12:00:00Z",
    updated_at: "2024-01-15T12:00:00Z",
    confirmed: true,
    discount: 0,
    payment_method: "cash",
  },
  {
    transaction_id: "2",
    user_id: "user1",
    category_id: "cat2",
    type: "income",
    description: "Gaji bulanan",
    amount: 5000000,
    source: "manual",
    transaction_date: "2024-01-01T09:00:00Z",
    ai_category_confidence: 0.95,
    is_auto_categorized: false,
    created_at: "2024-01-01T09:00:00Z",
    updated_at: "2024-01-01T09:00:00Z",
    confirmed: true,
    discount: 0,
    payment_method: "bank_transfer",
  },
  {
    transaction_id: "3",
    user_id: "user1",
    category_id: "cat3",
    type: "expense",
    description: "Bensin motor",
    amount: 25000,
    source: "manual",
    transaction_date: "2024-01-14T15:30:00Z",
    ai_category_confidence: 0.9,
    is_auto_categorized: true,
    created_at: "2024-01-14T15:30:00Z",
    updated_at: "2024-01-14T15:30:00Z",
    confirmed: true,
    discount: 0,
    payment_method: "credit_card",
  },
  {
    transaction_id: "4",
    user_id: "user1",
    category_id: "cat4",
    type: "expense",
    description: "Listrik bulanan",
    amount: 150000,
    source: "manual",
    transaction_date: "2024-01-10T08:00:00Z",
    ai_category_confidence: 0.88,
    is_auto_categorized: false,
    created_at: "2024-01-10T08:00:00Z",
    updated_at: "2024-01-10T08:00:00Z",
    confirmed: true,
    discount: 0,
    payment_method: "bank_transfer",
  },
  {
    transaction_id: "5",
    user_id: "user1",
    category_id: "cat5",
    type: "expense",
    description: "Belanja online",
    amount: 200000,
    source: "manual",
    transaction_date: "2024-01-12T20:15:00Z",
    ai_category_confidence: 0.75,
    is_auto_categorized: true,
    created_at: "2024-01-12T20:15:00Z",
    updated_at: "2024-01-12T20:15:00Z",
    confirmed: false,
    discount: 10000,
    payment_method: "credit_card",
  },
];

// Mock overview data for fallback
const MOCK_OVERVIEW: OverviewData = {
  total_income: "Rp 5,000,000",
  total_expense: "Rp 425,000",
  total_transactions: "Rp 4,575,000",
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    { token, params }: { token: string; params: TransactionParams },
    { rejectWithValue },
  ) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.offset) queryParams.append("offset", params.offset.toString());
      if (params.category_id)
        queryParams.append("category_id", params.category_id);
      if (params.search) queryParams.append("search", params.search);
      if (params.startDate) queryParams.append("start_date", params.startDate);
      if (params.endDate) queryParams.append("end_date", params.endDate);

      const response = await fetch(
        `${API_BASE_URL}/transactions?${queryParams}`,
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

      const data: TransactionResponse = await response.json();

      return { data, params };
    } catch (error: any) {
      console.log("API not available, using mock data", error.message);

      // Return mock data with the same structure as API
      let filteredTransactions = [...MOCK_TRANSACTIONS];

      // Apply client-side filtering for mock data
      if (params.category_id) {
        filteredTransactions = filteredTransactions.filter(
          (t) => t.category_id === params.category_id,
        );
      }

      if (params.search) {
        filteredTransactions = filteredTransactions.filter((t) =>
          t.description.toLowerCase().includes(params.search!.toLowerCase()),
        );
      }

      if (params.startDate && params.endDate) {
        const start = new Date(params.startDate);
        const end = new Date(params.endDate);

        filteredTransactions = filteredTransactions.filter((t) => {
          const date = new Date(t.transaction_date);

          return date >= start && date <= end;
        });
      }

      // Apply pagination
      const limit = params.limit || 10;
      const offset = params.offset || 1;
      const startIdx = (offset - 1) * limit;
      const paginatedTransactions = filteredTransactions.slice(
        startIdx,
        startIdx + limit,
      );

      const mockResponse: TransactionResponse = {
        status: 200,
        message: "Mock transactions retrieved successfully",
        data: paginatedTransactions,
        pagination: {
          total: filteredTransactions.length,
          current_page: offset,
          total_pages: Math.ceil(filteredTransactions.length / limit),
        },
      };

      return { data: mockResponse, params };
    }
  },
);

export const fetchOverview = createAsyncThunk(
  "transactions/fetchOverview",
  async (
    { token, params }: { 
      token: string; 
      params?: { startDate?: string; endDate?: string; category_id?: string } 
    }, 
    { rejectWithValue }
  ) => {
    try {
      // Build query parameters for overview
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append("start_date", params.startDate);
      if (params?.endDate) queryParams.append("end_date", params.endDate);
      if (params?.category_id) queryParams.append("category_id", params.category_id);

      const url = `${API_BASE_URL}/transactions/overviews${queryParams.toString() ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OverviewResponse = await response.json();

      return data.data;
    } catch (error: any) {
      console.log("API not available, using mock overview data", error.message);

      // Return mock data with the same structure as API
      return MOCK_OVERVIEW;
    }
  },
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (
    {
      token,
      transaction,
    }: {
      token: string;
      transaction: Omit<
        Transaction,
        "transaction_id" | "user_id" | "created_at" | "updated_at"
      >;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error: any) {
      // Mock success for development
      console.log("API not available, using mock creation");

      const mockTransaction: Transaction = {
        ...transaction,
        transaction_id: Date.now().toString(), // Mock ID
        user_id: "user1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        status: 201,
        message: "Transaction created successfully",
        data: mockTransaction,
      };
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (
    {
      token,
      id,
      transaction,
    }: { token: string; id: string; transaction: Partial<Transaction> },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error: any) {
      // Mock success for development
      console.log("API not available, using mock update");

      return {
        status: 200,
        message: "Transaction updated successfully",
        data: { id, ...transaction },
      };
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async ({ token, id }: { token: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return { ...data, id };
    } catch (error: any) {
      // Mock success for development
      console.log("API not available, using mock deletion");

      return {
        status: 200,
        message: "Transaction deleted successfully",
        id,
      };
    }
  },
);

// Initial state
const initialState: TransactionState = {
  transactions: [],
  pagination: {
    total: 0,
    current_page: 0,
    total_pages: 0,
  },
  overview: null,
  loading: false,
  overviewLoading: false,
  error: null,
  overviewError: null,
  lastFetchParams: null,
};

// Slice
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearOverviewError: (state) => {
      state.overviewError = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination = {
        total: 0,
        current_page: 0,
        total_pages: 0,
      };
    },
    clearOverview: (state) => {
      state.overview = null;
    },
    setTransactionLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        const { data, params } = action.payload;

        state.transactions = data.data || [];
        state.pagination = data.pagination;
        state.lastFetchParams = params;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })

      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new transaction to the beginning of the list
        if (action.payload.data) {
          state.transactions.unshift(action.payload.data);
          state.pagination.total += 1;
        }
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create transaction";
      })

      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTransaction = action.payload.data;

        if (updatedTransaction) {
          const index = state.transactions.findIndex(
            (t) => t.transaction_id === updatedTransaction.transaction_id,
          );

          if (index !== -1) {
            state.transactions[index] = {
              ...state.transactions[index],
              ...updatedTransaction,
            };
          }
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update transaction";
      })

      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id;

        state.transactions = state.transactions.filter(
          (t) => t.transaction_id !== deletedId,
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete transaction";
      })

      // Fetch Overview
      .addCase(fetchOverview.pending, (state) => {
        state.overviewLoading = true;
        state.overviewError = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.overviewError =
          action.error.message || "Failed to fetch overview";
      });
  },
});

export const {
  clearTransactionError,
  clearOverviewError,
  clearTransactions,
  clearOverview,
  setTransactionLoading,
} = transactionSlice.actions;
export default transactionSlice.reducer;
