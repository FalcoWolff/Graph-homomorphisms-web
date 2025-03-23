import {useDispatch, useSelector} from "react-redux";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Card, CardActionArea, CardContent, Container, IconButton, Typography } from "@mui/material";
import { insertTask } from "../../../store/tasksSlice";
import { useState } from "react";
import { useNavigate } from "react-router";
import BuildIcon from '@mui/icons-material/Build';

export default function TaskList({}) {

    const tasks = useSelector(state => state.tasks.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log(tasks)

    const [nextTaskId, setNextTaskId] = useState(0);

    function addNewTask() {
        console.log("add new task");
        dispatch(insertTask({id: nextTaskId, status: "rework"}));
        setNextTaskId(nextTaskId+1)
    }

    function onTaskClick(id) {
        navigate(`/task/${id}`)
    }

    return (<Container sx={{height: '100%'}}>
        <Typography variant="h4" sx={{margin: "16px 32px", textAlign: "center"}}>Tasks</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tasks.map((e) => {
                const status = e.status;
                return (
                <Card>
                    <CardActionArea onClick={() => {onTaskClick(e.id)}}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Typography variant="h5">Task {e.id}</Typography>
                                {status == "rework" && <BuildIcon />}
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