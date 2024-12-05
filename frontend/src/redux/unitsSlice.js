import axios from 'axios';
import Cookies from 'js-cookie'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { setUser, register, login } from './auth/authSlice'

const API_URL = import.meta.env.MODE === 'production' ? '/api' : "http://localhost:8080/api";

let initialState = {
    pc: {
        devices: 0,
        hourPrice: 6,
    },
    ps4: {
        devices: 0,
        singlePrice: 10,
        multiPrice: 15,
    },
    ps5: {
        devices: 0,
        singlePrice: 15,
        multiPrice: 20,
    },
    request: {
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: ''
    }
};

export const updateUnits = createAsyncThunk('units/update', async (data, thunkAPI) => {
    try {

        const token = Cookies.get('token')
        const res = await axios.put(API_URL + '/units', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data;

    } catch(error) {
        const message =
            (error.response &&
            error.response.data &&
            error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
})

export const unitsSlice = createSlice({
    name: "units",
    initialState,
    reducers: {
        reset(state) {
            state.request = initialState.request
        }
    },
    extraReducers: builder => {
        builder
            .addCase(setUser, (state, action) => ({...action.payload.units, request: initialState.request}))
            .addCase(login.fulfilled, (state, action) => ({...action.payload.user.units, request: initialState.request}))
            .addCase(register.fulfilled, (state, action) => ({...action.payload.user.units, request: initialState.request}))

            .addCase(updateUnits.pending, (state, action) => {
                return {
                    ...state, 
                    request: {
                        ...state.request,
                        isLoading: true
                    }
                }
            })
            .addCase(updateUnits.fulfilled, (state, action) => {
                return {
                    ...action.payload,
                    request: {
                        isLoading: false,
                        isError: false,
                        isSuccess: true,
                        message: "Updated Successfully"
                    }
                }
            })
            .addCase(updateUnits.rejected, (state, action) => {
                return {
                    ...state, 
                    request: {
                        ...state.request,
                        isLoading: false,
                        isError: true,
                        message: action.payload
                    }
                }
            })
    }
});

export const { reset } = unitsSlice.actions;

export default unitsSlice.reducer;
