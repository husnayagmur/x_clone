import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@env';

// Async Thunks: API requests for user actions

// Kullanıcı profilini getir
export const getUserProfile = createAsyncThunk('user/getUserProfile', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/profile`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Takip et
export const followUser = createAsyncThunk('user/followUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/user/${userId}/follow`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Takipten çık
export const unfollowUser = createAsyncThunk('user/unfollowUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/user/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Takipçi listesi getir
export const getFollowers = createAsyncThunk('user/getFollowers', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/followers`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Kullanıcı avatarını güncelle
export const updateAvatar = createAsyncThunk('user/updateAvatar', async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/user/${formData.userId}/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Initial State
const initialState = {
  user: null,
  followers: [],
  isLoading: false,
  error: null,
};

// Slice definition
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.followers = action.payload.followers;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Follow User
      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Unfollow User
      .addCase(unfollowUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Get Followers
      .addCase(getFollowers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followers = action.payload;
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Update Avatar
      .addCase(updateAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user.avatar = action.payload.avatar;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
