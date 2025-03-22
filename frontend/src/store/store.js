import {configureStore} from "@reduxjs/toolkit"
import tasksSlice from "./tasksSlice"

export default configureStore({reducer: {
    tasks: tasksSlice
}})
