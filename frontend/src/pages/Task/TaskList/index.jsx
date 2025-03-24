import {useDispatch, useSelector} from "react-redux";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Card, CardActionArea, CardContent, Container, IconButton, Typography } from "@mui/material";
import { insertTask } from "../../../store/tasksSlice";
import { useState } from "react";
import { useNavigate } from "react-router";
import BuildIcon from '@mui/icons-material/Build';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function TaskList({}) {

    const tasks = useSelector(state => state.tasks.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [nextTaskId, setNextTaskId] = useState(0);

    function addNewTask() {
        console.log("add new task");
        dispatch(insertTask({status: "rework"}));
        setNextTaskId(nextTaskId+1)
    }

    function onTaskClick(id) {
        navigate(`/task/${id}`)
    }

    return (<Container sx={{height: '100%'}}>
        <Typography variant="h4" sx={{margin: "16px 32px", textAlign: "center"}}>Tasks</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tasks.map((e,index) => {
                const status = e.status;
                return (
                <Card>
                    <CardActionArea onClick={() => {onTaskClick(index)}}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Typography variant="h5">Task {index}</Typography>
                                {status == "rework" && <BuildIcon />}
                                {status == "running" && (<CachedIcon sx={{ fontSize: '40px'}} />)}
                                {status == "completed" && <CheckCircleOutlineIcon sx={{ fontSize: '40px'}} color="success"/>}
                             </Box>
                        </CardContent>
                    </CardActionArea>
                </Card>
                )
            }
            )}
        </Box>
        <IconButton onClick={addNewTask} size="large">
            <AddCircleOutlineIcon fontSize="large"/>
        </IconButton>
    </Container>);

}