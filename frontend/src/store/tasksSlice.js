import { createSlice } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {value: []},
    reducers: {
        setTasks: (state, action) => {
            state.value = action.payload
        },
        updateTask: (state, action) => {
            const { id, updatedTask } = action.payload;
            const index = state.value.findIndex(task => task.id === id);
            if (index !== -1) {
                state.value[index] = { ...state.tasks[index], ...updatedTask };
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