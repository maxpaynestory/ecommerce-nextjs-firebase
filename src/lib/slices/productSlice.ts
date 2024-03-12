import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showError } from "../../helpers/utils";
import firebaseInstance from "../../firebase/firebaseClient";

interface ReqStatus {
  pending: boolean;
}

interface SliceState {
  getProductsStatus: ReqStatus;
}

const initialState: SliceState = {
  getProductsStatus: {
    pending: false,
  },
};

export const getProductsAdmin = createAsyncThunk<any, any>(
  "product/list",
  async (values: any, { rejectWithValue }): Promise<any> => {
    try {
      /////// place firebase login code here /////
      const products = await firebaseInstance.getProductsAdmin();
      return products;
    } catch (error: any) {
      return rejectWithValue("Failed to get products");
    }
  }
);

export const productSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(getProductsAdmin.pending, (state: SliceState) => {
        state.getProductsStatus.pending = true;
      })
      .addCase(getProductsAdmin.fulfilled, (state: SliceState) => {
        state.getProductsStatus.pending = false;
      })
      .addCase(getProductsAdmin.rejected, (state: SliceState, action) => {
        state.getProductsStatus.pending = false;
        showError("Failed to get products");
      });
  },
  name: "product",
  initialState: initialState,
  reducers: {},
});

export default productSlice.reducer;
export const getProductsStatusPending = (state: any) =>
  state.product.getProductsStatus.pending;
