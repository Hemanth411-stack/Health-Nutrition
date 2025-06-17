import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper function to safely get user from localStorage
export const getUserFromLocalStorage = () => {
  try {
    const persistedState = localStorage.getItem('persist:root');
    if (!persistedState) return null;
    
    const parsedState = JSON.parse(persistedState);
    if (!parsedState.user) return null;
    
    const userState = JSON.parse(parsedState.user);
    return userState.userInfo || null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const initialState = {
  userInfo: null,
  status: 'idle',
  error: null
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.userInfo = null;
      localStorage.removeItem('persist:root');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;