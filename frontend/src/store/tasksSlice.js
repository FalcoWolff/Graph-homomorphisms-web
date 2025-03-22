import { createSlice } from "@reduxjs/toolkit";

export default tasksSlice = createSlice({
    name: 'tasks',
    initialState: {tasks: []},
    reducers: {
        setTasks: (state, action) => {
            state.tasks = action.payload
        },
        updateTask: (state, action) => {
            const { id, updatedTask } = action.payload;
            const index = state.tasks.findIndex(task => task.id === id);
            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...updatedTask };
            }
        },
        insertTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter((e,index) => index != action.payload);
        }
    }
})

export const {setTasks} = tasksSlice.action