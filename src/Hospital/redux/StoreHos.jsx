import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSliceHos';

export const store1 = configureStore({
    reducer: {
        auth: authReducer,
    },
});
