import { createSlice } from "@reduxjs/toolkit";

let theme = localStorage.getItem('theme')

let initialState = theme ? JSON.parse(theme) : {
    isDark: true,
    bgLinear: false,
    colors: { main: '#2980B9', rgbmain: '41, 128, 185', mainBg: "#001529" }
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme: (state, action) => {
            localStorage.setItem('theme', JSON.stringify(action.payload))
            return action.payload
        }
    }
})

export const { changeTheme } = themeSlice.actions

export default themeSlice.reducer