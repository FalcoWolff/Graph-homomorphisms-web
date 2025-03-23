import { useParams } from "react-router"
import TaskList from "./TaskList";
import { Box, Checkbox, Container, FormControl, FormControlLabel, Grid2 as Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateTask as updateTask_ } from "../../store/tasksSlice";

export default function Task({}) {

    const params = useParams();
    const taskId = parseInt(params.taskId)
    const dispatch = useDispatch();
    const task = (useSelector(state => state.tasks.value)).find(e => e.id == taskId);
    console.log(task)

    const type = task?.type ?? "hom";
    const cfi = task?.cfi ?? false;

    function updateTask(field, value) {
        const newTask = {...task}
        newTask[field] = value
        dispatch(updateTask_({id: taskId, task: newTask}));
    }

    return (
    <Grid container spacing={2}>
        <Grid item xs={2}>
            <TaskList/>
        </Grid>
        <Grid item xs={10}>
            <Box>
                <Typography variant="h4">Task {taskId}</Typography>
                <Typography>Status: rework</Typography>
                <FormControl>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={type}
                        onChange={(event) => {updateTask("type",event.target.value)}}
                        label="Type"
                    >
                        <MenuItem value={"hom"}>Homomorphism</MenuItem>
                        <MenuItem value={"emb"}>Embedding</MenuItem>
                        <MenuItem value={"mat"}>k-Matching</MenuItem>
                    </Select>
                </FormControl>
                <Typography variant="body1">
                    CFI: 
                    <FormControlLabel
                        control={<Checkbox checked={cfi} onChange={() => {updateTask("cfi", !cfi)}} />}
                        label=""
                    />
                </Typography>
            </Box>
        </Grid>
    </Grid>
    )
}