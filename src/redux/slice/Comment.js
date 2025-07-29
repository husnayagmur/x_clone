import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@env';  // API_URL'yi env'den alıyoruz

// Async Thunks: API istekleri yapacak işlemler

// Yorum ekle (addComment)
export const addComment = createAsyncThunk('comments/addComment', async ({ tweetId, content }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${tweetId}`, { content });
    return response.data; // Success: returns data from server
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Yorumları getir (getComments)
export const getComments = createAsyncThunk('comments/getComments', async (tweetId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/comments/tweet/${tweetId}`);
    return response.data; // Success: returns data from server
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Yorum sil (deleteComment)
export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`);
    return response.data; // Success: returns data from server
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Initial State
const initialState = {
  comments: [],
  isLoading: false,
  error: null,
};

// Slice definition
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments.push(action.payload.comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      
      // Get Comments
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = state.comments.filter((comment) => comment._id !== action.payload._id);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

// Reducer
export default commentsSlice.reducer;
