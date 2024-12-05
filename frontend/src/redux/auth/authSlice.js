import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AuthServices from './authServices'
import Cookies from 'js-cookie'

const initialState = {
    user: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

// Async Actions
export const register = createAsyncThunk("auth/register", async (formData, thunkAPI) => {
    try {    
        
        return await AuthServices.register(formData)

    } catch (error) {
        const message =
            (error.response &&
            error.response.data &&
            error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
})

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {

    try {    
    
        const res =  await AuthServices.login(userData)
        // thunkAPI.dispatch(getItems())
        return res;
    } catch (error) {
        const message =
            (error.response &&
            error.response.data &&
            error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
})

export const updateUser = createAsyncThunk("auth/updateUser", async (userData, thunkAPI) => {

    try {    
    
    return await AuthServices.updateUser(userData)

    } catch (error) {
        const message =
            (error.response &&
            error.response.data &&
            error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
})

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (verifyCode, thunkAPI) => {
    try {    
    
        return await AuthServices.verifyEmail(verifyCode)
    
    } catch (error) {
        const message =
            (error.response &&
            error.response.data &&
            error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
})

export const resetPassword = createAsyncThunk("auth/resetPassword", async (userData, thunkAPI) => {
    try {    
        let data = await AuthServices.resetPassword(userData)
        if (data.status === 'fail' || data.status === 'error') return thunkAPI.rejectWithValue(data.message)
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const deleteUser = createAsyncThunk("auth/deleteUser", async (userData, thunkAPI) => {
    try {    
        return await AuthServices.deleteUser()
    
    } catch (error) {
        const message =
            (error.response &&
            error.response.data &&
            error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
})

// Create Auth Slice
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset(state) {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        setUser(state, action) {
            let user = { ...action.payload }
            delete user.units;
            state.user = user
        },
        logout(state) {
            state.user = null;
            Cookies.remove('token')
        }
    },
    extraReducers: builder => {
        builder
        // Register
        .addCase(register.pending, state => ({...state, isLoading: true}))
        .addCase(register.fulfilled, (state, action) => {
            let user = { ...action.payload.user }
            delete user.units;
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                message: action.payload.message,
                user
            }
        })
        .addCase(register.rejected, (state, action) => {
            return {
            ...state,
            isLoading: false,
            isError: true,
            message: action.payload
            }
        })
        // Login
        .addCase(login.pending, state => ({...state, isLoading: true}))
        .addCase(login.fulfilled, (state, action) => {
            let user = { ...action.payload.user }
            delete user.units;
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                message: action.payload.message,
                user
            }
        })
        .addCase(login.rejected, (state, action) => {
            return {
            ...state,
            isLoading: false,
            isError: true,
            message: action.payload
            }
        })
        // Update User
        .addCase(updateUser.pending, state => ({...state, isLoading: true}))
        .addCase(updateUser.fulfilled, (state, action) => {
            return {
            ...state,
            isLoading: false,
            isSuccess: true,
            message: action.payload.message,
            user: action.payload.user
            }
        })
        .addCase(updateUser.rejected, (state, action) => {
            return {
            ...state,
            isLoading: false,
            isError: true,
            message: action.payload
            }
        })
        // Verify Email
        .addCase(verifyEmail.pending, state => ({...state, isLoading: true}))
        .addCase(verifyEmail.fulfilled, (state, action) => {
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                message: action.payload.message,
                user: {
                    ...state.user,
                    emailVerified: true
                }
            }
        })
        .addCase(verifyEmail.rejected, (state, action) => {
            return {
            ...state,
            isLoading: false,
            isError: true,
            message: action.payload
            }
        })
        // Delete User
        .addCase(deleteUser.pending, state => ({...state, isLoading: true}))
        .addCase(deleteUser.fulfilled, (state, action) => {
            return {
            ...state,
            isLoading: false,
            isSuccess: true,
            message: action.payload.message,
            user: null
            }
        })
        .addCase(deleteUser.rejected, (state, action) => {
            return {
            ...state,
            isLoading: false,
            isError: true,
            message: action.payload
            }
        })
    }
})

export const { setUser, logout, reset } = authSlice.actions
export default authSlice.reducer