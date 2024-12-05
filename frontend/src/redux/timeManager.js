import { createSlice } from "@reduxjs/toolkit"
import { login, register, setUser } from "./auth/authSlice"
import { updateUnits } from "./unitsSlice"

const template = {
    status: 0,// 0 = Not start yet, 1 = paused, 2 = Running...
    duration: 0,
    durationWork: false,
    startTime: '00:00',
    orders: []
}

function createManager(data) {

    let state = []
    for (let i = 0;i < data.pc.count;i++) state.push({
        unitId: `#PC_${i+1}`,
        unitType: 'pc',
        unitNumber: i + 1,
        mode: 'pc',
        hourPrice: data.pc.price,
        ...template,
    })

    for (let i = 0;i < data.ps4.count;i++) state.push({
        unitId: `#PS4_${i+1}`,
        unitType: 'ps4',
        unitNumber: i + 1,
        mode: 'single',
        hourPrice: data.ps4.singlePrice,
        ...template,
    })

    for (let i = 0;i < data.ps5.count;i++) state.push({
        unitId: `#PS5_${i+1}`,
        unitType: 'ps5',
        unitNumber: i + 1,
        mode: 'single',
        hourPrice: data.ps5.singlePrice,
        ...template,
    })
    
    return state;

}

const initialState = []

export const timeManagerSlice = createSlice({
    name: "timeManager",
    initialState,
    reducers: {
        startUnit(state, action) { // action.payload = "unitId"
            
            let index = state.findIndex(item => item.unitId == action.payload);
            let unit = state[index]

            let date = new Date();
            let hours = date.getHours()
            let hoursBy12 = hours > 12 ? hours - 12 : hours ;
            let minutes = date.getMinutes()
            let startTime = `${hoursBy12 < 10 ? '0' + hoursBy12 : hoursBy12}:${minutes < 10 ? '0' + minutes : minutes}`;
            
            unit.startTime = startTime
            unit.status = 2
            unit.durationWork = true

            state[index] = unit
            
        },
        pauseUnit(state, action) { // action.payload = "unitId"

            let index = state.findIndex(item => item.unitId == action.payload);
            let unit = state[index]

            unit.status = 1
            unit.durationWork = false
            
            state[index] = unit
        },
        resumeUnit(state, action) { // action.payload = "unitId"
            let index = state.findIndex(item => item.unitId == action.payload);
            let unit = state[index]

            unit.status = 2
            unit.durationWork = true

            state[index] = unit
        },
        endUnit(state, action) { // action.payload = "unitId"
            let index = state.findIndex(item => item.unitId == action.payload);
            let unit = state[index]

            unit.status = 0
            unit.durationWork = false
            unit.duration = 0
            unit.startTime = '00:00'
            unit.orders = []

            state[index] = unit
        },
        incrementTime(state, action) { // action.payload = "unitId"
            let index = state.findIndex(item => item.unitId == action.payload);
            let unit = state[index]

            unit.duration += 1

            state[index] = unit
        },
        changeMode(state, action) { // action.payload = { unitId: "", mode: "", price: 0}
            let index = state.findIndex(item => item.unitId == action.payload.unitId);
            let unit = state[index]
            
            unit.mode = action.payload.mode
            unit.hourPrice = action.payload.price

            state[index] = unit
        },
        addOrder(state, action) { // action.payload = { unitId: "", order: {} }
            let index = state.findIndex(item => item.unitId == action.payload.unitId);
            let unit = state[index]

            unit.orders.push(action.payload.order)

            state[index] = unit
        }
    },
    extraReducers: builder => {
        builder
            .addCase(setUser, (state, action) => state = createManager(action.payload.units))
            .addCase(login.fulfilled, (state, action) => state = createManager(action.payload.user.units))
            .addCase(register.fulfilled, (state, action) => state = createManager(action.payload.user.units))
            .addCase(updateUnits.fulfilled, (state, action) => state = createManager(action.payload))
    }
});


export const { 
    startUnit,
    pauseUnit,
    resumeUnit,
    endUnit,
    incrementTime,
    changeMode,
    addOrder
} = timeManagerSlice.actions;

export default timeManagerSlice.reducer;