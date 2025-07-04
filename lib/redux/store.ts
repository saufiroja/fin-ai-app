import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import userReducer from "./userSlice";
import transactionReducer from "./transactionSlice";
import categoryReducer from "./categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    transactions: transactionReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
