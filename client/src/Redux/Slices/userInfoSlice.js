// userInfoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import getTokenFromLocalStorage from "./userSlice.js"
const API_URL = 'https://health-nutrition-2.onrender.com/api/userinfo/';

// Async Thunks
export const fetchUserInfo = createAsyncThunk(
  'userInfo/fetchUserInfo',
  async (userId, { rejectWithValue }) => {
    try {
      const token = getTokenFromLocalStorage()
      const response = await axios.get(`${API_URL}`,{
        headers: {
          Authorization: `Bearer ${token}`, // for JWT-based auth
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'userInfo/updateUserInfo',
  async ( userData , { getState, rejectWithValue }) => {
    try {
      const token = getState().user?.userInfo?.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.post(
        API_URL,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);


// Initial State
const initialState = {
  userInfo: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  saveStatus: 'idle', // For update operations
};

// Slice
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    resetUserInfoStatus(state) {
      state.saveStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Fetch User Info
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
        console.log("userinfo",state.userInfo)
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch user info';
      })
      
      // Update User Info
      .addCase(updateUserInfo.pending, (state) => {
        state.saveStatus = 'loading';
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload?.message || 'Failed to update user info';
      });
  },
});

// Export Actions and Reducer
export const { resetUserInfoStatus } = userInfoSlice.actions;
export default userInfoSlice.reducer;

// Selectors
export const selectUserInfo = (state) => state.userInfo.userInfo;
export const selectUserInfoStatus = (state) => state.userInfo.status;
export const selectUserInfoSaveStatus = (state) => state.userInfo.saveStatus;
export const selectUserInfoError = (state) => state.userInfo.error;