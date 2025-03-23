import {configureStore} from "@reduxjs/toolkit"
import tasksSlice from "./tasksSlice.js"

export default configureStore({reducer: {
    tasks: tasksSlice
}})
