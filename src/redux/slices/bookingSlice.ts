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

        removeBookingItem: (state, action: PayloadAction<{ id: number | string; type: string }>) => {
            const { id, type } = action.payload;

            // 1. Remove item
            state.selectedServices = state.selectedServices.filter(
                (item) => !(item.id === id && item.type === type)
            );

            // 2. Recalculate Totals (Basic logic, assuming promo might be static or re-applied on previous page)
            // Ideally, promo logic should be portable, but for simple removal:
            const newSubTotal = state.selectedServices.reduce((sum, item) => sum + item.price, 0);

            // Recalculate discount proportionally or reset?
            // For safety in this context, we'll keep the discount percentage if possible,
            // or just recalculate simple totals.
            // Let's assume a simple recalculation for now:
            const discountRatio = state.totals.subTotal > 0 ? state.totals.discount / state.totals.subTotal : 0;
            const newDiscount = newSubTotal * discountRatio;

            state.totals = {
                subTotal: newSubTotal,
                discount: newDiscount,
                total: Math.max(0, newSubTotal - newDiscount)
            };
        }
    },
});

export const { setBookingData, clearBookingData, removeBookingItem } = bookingSlice.actions;
export default bookingSlice.reducer;