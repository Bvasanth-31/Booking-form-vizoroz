import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './BookingSlice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
  },
});

