import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Types
export interface ReceiptItem {
  receipt_item_id: string;
  receipt_id: string;
  item_name: string;
  item_quantity: number;
  item_price: number;
  item_price_total: number;
  item_discount: number;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  receipt_id: string;
  user_id: string;
  merchant_name: string;
  subtotal?: number;
  sub_total?: number;
  total_discount: number;
  total_shopping: number;
  confirmed: boolean;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  items?: ReceiptItem[];
}

export interface ReceiptPagination {
  total: number;
  current_page: number;
  total_pages: number;
}

export interface ReceiptParams {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ReceiptState {
  currentReceipt: Receipt | null;
  receipts: Receipt[];
  pagination: ReceiptPagination;
  uploading: boolean;
  loading: boolean;
  fetchingReceipts: boolean;
  error: string | null;
  receiptsError: string | null;
  uploadProgress: number;
  lastFetchParams: ReceiptParams | null;
}

const initialState: ReceiptState = {
  currentReceipt: null,
  receipts: [],
  pagination: {
    total: 0,
    current_page: 1,
    total_pages: 0,
  },
  uploading: false,
  loading: false,
  fetchingReceipts: false,
  error: null,
  receiptsError: null,
  uploadProgress: 0,
  lastFetchParams: null,
};

// Upload receipt
export const uploadReceipt = createAsyncThunk(
  "receipt/upload",
  async (
    { token, file }: { token: string; file: File },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();

      formData.append("receipt", file);

      const response = await fetch(`${API_BASE_URL}/receipts/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || "Failed to upload receipt",
      });
    }
  },
);

// Get receipt details
export const getReceiptDetails = createAsyncThunk(
  "receipt/getDetails",
  async (
    { token, receiptId }: { token: string; receiptId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/receipts/detail/user/${receiptId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || "Failed to get receipt details",
      });
    }
  },
);

// Confirm receipt
export const confirmReceipt = createAsyncThunk(
  "receipt/confirm",
  async (
    { token, receiptId }: { token: string; receiptId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/receipts/confirm/${receiptId}?confirmed=true`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || "Failed to confirm receipt",
      });
    }
  },
);

// Fetch user receipts
export const fetchUserReceipts = createAsyncThunk(
  "receipt/fetchUserReceipts",
  async (
    { token, params }: { token: string; params?: ReceiptParams },
    { rejectWithValue },
  ) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.offset)
        queryParams.append("offset", params.offset.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${API_BASE_URL}/receipts/user${queryParams.toString() ? `?${queryParams}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return { data: data.data, pagination: data.pagination, params };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || "Failed to fetch receipts",
      });
    }
  },
);

const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {
    clearReceipt: (state) => {
      state.currentReceipt = null;
      state.error = null;
      state.uploadProgress = 0;
    },
    clearReceipts: (state) => {
      state.receipts = [];
      state.pagination = {
        total: 0,
        current_page: 1,
        total_pages: 0,
      };
      state.receiptsError = null;
      state.lastFetchParams = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearReceiptsError: (state) => {
      state.receiptsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload receipt
      .addCase(uploadReceipt.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadReceipt.fulfilled, (state, action) => {
        state.uploading = false;
        state.currentReceipt = action.payload;
        state.uploadProgress = 100;
      })
      .addCase(uploadReceipt.rejected, (state, action) => {
        state.uploading = false;
        state.error = (action.payload as any)?.message || "Upload failed";
        state.uploadProgress = 0;
      })
      // Get receipt details
      .addCase(getReceiptDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceiptDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReceipt = action.payload;
      })
      .addCase(getReceiptDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || "Failed to get receipt details";
      })
      // Confirm receipt
      .addCase(confirmReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmReceipt.fulfilled, (state) => {
        state.loading = false;
        if (state.currentReceipt) {
          state.currentReceipt.confirmed = true;
        }
      })
      .addCase(confirmReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message || "Failed to confirm receipt";
      })
      // Fetch user receipts
      .addCase(fetchUserReceipts.pending, (state) => {
        state.fetchingReceipts = true;
        state.receiptsError = null;
      })
      .addCase(fetchUserReceipts.fulfilled, (state, action) => {
        state.fetchingReceipts = false;
        state.receipts = action.payload.data;
        state.pagination = action.payload.pagination;
        state.lastFetchParams = action.payload.params || null;
      })
      .addCase(fetchUserReceipts.rejected, (state, action) => {
        state.fetchingReceipts = false;
        state.receiptsError =
          (action.payload as any)?.message || "Failed to fetch receipts";
      });
  },
});

export const {
  clearReceipt,
  clearReceipts,
  setUploadProgress,
  clearError,
  clearReceiptsError,
} = receiptSlice.actions;
export default receiptSlice.reducer;
