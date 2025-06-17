import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      console.log("fetching products",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createNewProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  products: [],
  currentProduct: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    resetProductStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      
      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch product';
      })
      
      // Create Product
      .addCase(createNewProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNewProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(createNewProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create product';
      });
  },
});

// Export Actions and Reducer
export const { clearCurrentProduct, resetProductStatus } = productSlice.actions;
export default productSlice.reducer;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductStatus = (state) => state.products.status;
export const selectProductError = (state) => state.products.error;