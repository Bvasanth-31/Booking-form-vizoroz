import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5181/api/booking');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching bookings');
    }
  }
);

export const submitBooking = createAsyncThunk(
  'booking/submitBooking',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5181/api/booking', formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error submitting booking');
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'booking/deleteBooking',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5181/api/booking/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'booking/updateBooking',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5181/api/booking/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update booking');
    }
  }
);


const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    selectedBooking: null, 
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload; 
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(submitBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings.push(action.payload);
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});


export const {
  resetStatus,
  setBookings,
  setSelectedBooking,
  clearSelectedBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;


