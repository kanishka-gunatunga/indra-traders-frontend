import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
    vehicleData: any | null; // Stores the form data from Service Park page
    selectedServices: any[]; // Cart items
    totals: {
        subTotal: number;
        discount: number;
        total: number;
    };
    isFromServicePark: boolean;
}

const initialState: BookingState = {
    vehicleData: null,
    selectedServices: [],
    totals: { subTotal: 0, discount: 0, total: 0 },
    isFromServicePark: false,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingData: (state, action: PayloadAction<Omit<BookingState, 'isFromServicePark'>>) => {
            state.vehicleData = action.payload.vehicleData;
            state.selectedServices = action.payload.selectedServices;
            state.totals = action.payload.totals;
            state.isFromServicePark = true;
        },
        clearBookingData: (state) => {
            state.vehicleData = null;
            state.selectedServices = [];
            state.totals = { subTotal: 0, discount: 0, total: 0 };
            state.isFromServicePark = false;
        },
    },
});

export const { setBookingData, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;