import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '@env';

// Async Thunks: API istekleri yapacak işlemler

// Tweet oluştur
export const createTweet = createAsyncThunk('tweets/createTweet', async (tweetData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/tweets`, tweetData);
    return response.data;  // Success: returns data from server
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Tweetleri getir
export const getTweets = createAsyncThunk('tweets/getTweets', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/tweets`);
    return response.data;  // Success: returns data from server
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Tweet beğen
export const likeTweet = createAsyncThunk('tweets/likeTweet', async (tweetId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/tweets/${tweetId}/like`);
    return response.data;  // Success: returns data from server
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Retweet
export const retweet = createAsyncThunk('tweets/retweet', async (tweetId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/tweets/${tweetId}/retweet`);
    return response.data;  // Success: returns data from server
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Beğeni sayısını döndür
export const getLikeCount = createAsyncThunk('tweets/getLikeCount', async (tweetId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/tweets/${tweetId}/like-count`);
    return response.data;  // Success: returns like count
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Retweet yapan kullanıcıları döndür
export const getRetweetUsers = createAsyncThunk('tweets/getRetweetUsers', async (tweetId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/tweets/${tweetId}/retweet-count`);
    return response.data;  // Success: returns retweet users
  } catch (error) {
    return rejectWithValue(error.response.data);  // Error: returns error message
  }
});

// Initial State
const initialState = {
  tweets: [],
  isLoading: false,
  error: null,
};

// Slice definition
const tweetSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Tweet
      .addCase(createTweet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tweets.push(action.payload.tweet);
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      
      // Get Tweets
      .addCase(getTweets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tweets = action.payload;
      })
      .addCase(getTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      
      // Like Tweet
      .addCase(likeTweet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTweet = action.payload;
        const index = state.tweets.findIndex(tweet => tweet._id === updatedTweet._id);
        if (index !== -1) {
          state.tweets[index] = updatedTweet;
        }
      })
      .addCase(likeTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      
      // Retweet
      .addCase(retweet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(retweet.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTweet = action.payload;
        const index = state.tweets.findIndex(tweet => tweet._id === updatedTweet._id);
        if (index !== -1) {
          state.tweets[index] = updatedTweet;
        }
      })
      .addCase(retweet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      
      // Get Like Count
      .addCase(getLikeCount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLikeCount.fulfilled, (state, action) => {
        state.isLoading = false;
        const tweet = state.tweets.find(tweet => tweet._id === action.payload.tweetId);
        if (tweet) {
          tweet.likeCount = action.payload.likeCount;
        }
      })
      .addCase(getLikeCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      
      // Get Retweet Users
      .addCase(getRetweetUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRetweetUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        const tweet = state.tweets.find(tweet => tweet._id === action.payload.tweetId);
        if (tweet) {
          tweet.retweetUsers = action.payload.retweetedUsers;
        }
      })
      .addCase(getRetweetUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

// Reducer
export default tweetSlice.reducer;
