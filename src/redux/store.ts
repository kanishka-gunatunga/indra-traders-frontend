import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './slices/bookingSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    // We only want to persist the booking slice.
    // If you add more slices later, you can choose to whitelist or blacklist them.
    whitelist: ['booking'],
};

const persistedReducer = persistReducer(persistConfig, bookingReducer);

export const store = configureStore({
    // reducer: {
    //     booking: bookingReducer,
    // },
    reducer: {
        // We map 'booking' to the persisted reducer
        booking: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types to prevent Redux Toolkit warnings about non-serializable data
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;