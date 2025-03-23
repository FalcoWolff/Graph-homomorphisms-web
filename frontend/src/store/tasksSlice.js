import { createSlice } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {value: []},
    reducers: {
        setTasks: (state, action) => {
            state.value = action.payload
        },
        updateTask: (state, action) => {
            const { index, task } = action.payload;
            if (index < state.value.length) {
                state.value[index] = { ...state.value[index], ...task };
            }
        },
        insertTask: (state, action) => {
            state.value.push(action.payload);
        },
        deleteTask: (state, action) => {
            state.value = state.value.filter((e,index) => index != action.payload);
        }
    }
})

export const {setTasks, updateTask, insertTask, deleteTask} = tasksSlice.actions
export default tasksSlice.reducer