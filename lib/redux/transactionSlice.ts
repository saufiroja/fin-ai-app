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

export interface SingleTransactionResponse {
  status: number;
  message: string;
  data: Transaction | null;
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
  currentTransaction: Transaction | null;
  loading: boolean;
  overviewLoading: boolean;
  currentTransactionLoading: boolean;
  error: string | null;
  overviewError: string | null;
  currentTransactionError: string | null;
  lastFetchParams: TransactionParams | null;
}

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
      return rejectWithValue({
        message: error.message || "Failed to fetch transactions",
      });
    }
  },
);

export const fetchOverview = createAsyncThunk(
  "transactions/fetchOverview",
  async (
    {
      token,
      params,
    }: {
      token: string;
      params?: { startDate?: string; endDate?: string; category_id?: string };
    },
    { rejectWithValue },
  ) => {
    try {
      // Build query parameters for overview
      const queryParams = new URLSearchParams();

      if (params?.startDate) queryParams.append("start_date", params.startDate);
      if (params?.endDate) queryParams.append("end_date", params.endDate);
      if (params?.category_id)
        queryParams.append("category_id", params.category_id);

      const url = `${API_BASE_URL}/transactions/overviews${queryParams.toString() ? `?${queryParams}` : ""}`;

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
      return rejectWithValue({
        message: error.message || "Failed to fetch overview",
      });
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
      transaction: {
        category_id: string;
        type: "expense" | "income";
        description: string;
        amount: number;
        source: string;
        transaction_date: string;
        ai_category_confidence: number;
        is_auto_categorized: boolean;
        confirmed: boolean;
        discount: number;
        payment_method: string;
      };
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

      let data: SingleTransactionResponse = await response.json();

      return data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || "Failed to create transaction",
      });
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
      return rejectWithValue({
        message: error.message || "Failed to update transaction",
      });
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
      return rejectWithValue({
        message: error.message || "Failed to delete transaction",
      });
    }
  },
);

export const fetchTransactionById = createAsyncThunk(
  "transactions/fetchTransactionById",
  async ({ token, id }: { token: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SingleTransactionResponse = await response.json();

      return data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || "Failed to fetch transaction details",
      });
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
  currentTransaction: null,
  loading: false,
  overviewLoading: false,
  currentTransactionLoading: false,
  error: null,
  overviewError: null,
  currentTransactionError: null,
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
    clearCurrentTransactionError: (state) => {
      state.currentTransactionError = null;
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
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
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
      })

      // Fetch Transaction By ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.currentTransactionLoading = true;
        state.currentTransactionError = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.currentTransactionLoading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.currentTransactionLoading = false;
        state.currentTransactionError =
          action.error.message || "Failed to fetch transaction details";
      });
  },
});

export const {
  clearTransactionError,
  clearOverviewError,
  clearCurrentTransactionError,
  clearTransactions,
  clearOverview,
  clearCurrentTransaction,
  setTransactionLoading,
} = transactionSlice.actions;
export default transactionSlice.reducer;
