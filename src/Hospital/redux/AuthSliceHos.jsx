import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
    name: 'hospitalAuth',
    initialState: {
        user: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    }
});

export const { setUser, logout } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:8080/api/hospital_login/', credentials);
        dispatch(setUser(response.data.user));
    } catch (error) {
        console.error("Failed to login:", error);
    }
};

export default authSlice.reducer;
