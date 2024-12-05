import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import themeReducer from './themeSlice'
import unitsReducer from './unitsSlice'
import timeManagerReducer from './timeManager'
import { marketApi } from './merketApi'


const store =  configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        units: unitsReducer,
        timeManager: timeManagerReducer,
        [marketApi.reducerPath]: marketApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(marketApi.middleware)
})

export default store