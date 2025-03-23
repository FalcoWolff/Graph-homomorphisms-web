import {useDispatch, useSelector} from "react-redux";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Container, IconButton, Typography } from "@mui/material";
import { insertTask } from "../../../store/tasksSlice";
import { useState } from "react";

export default function TaskList({}) {

    const tasks = useSelector(state => state.tasks);
    const dispatch = useDispatch();

    const [nextTaskId, setNextTaskId] = useState(0);

    function addNewTask() {
        console.log("add new task");
        dispatch(insertTask({id: nextTaskId}));
        setNextTaskId(nextTaskId+1)
    }

    return (<Container>
        <Typography variant="h4">Tasks</Typography>
        <IconButton onClick={addNewTask} size="large">
            <AddCircleOutlineIcon fontSize="large"/>
        </IconButton>
    </Container>);

}