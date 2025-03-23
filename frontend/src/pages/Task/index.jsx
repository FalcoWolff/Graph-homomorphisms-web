import { useParams } from "react-router"
import TaskList from "./TaskList";
import { Box, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid, IconButton, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateTask as updateTask_ } from "../../store/tasksSlice";
import GraphDisplay from "./GraphDisplay";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import axios from "axios";

export default function Task({}) {

    const params = useParams();
    const taskIndex = parseInt(params.taskIndex)
    const dispatch = useDispatch();
    const task = useSelector(state => state.tasks.value[taskIndex])

    console.log(task)

    const [openG, setOpenG] = useState(true);
    const [openH, setOpenH] = useState(true);

    const status = task?.status ?? "rework";
    const type = task?.type ?? "hom";
    const cfi = task?.cfi ?? false;
    const invertedCfi = task?.invertedCfi ?? false;
    const G = task?.G ?? "";
    const H = task?.H ?? "";
    let description = "";

    switch(type) {
        case "emb":
            description = "Calculate the number of injective homs from H to G"
            break;
        case "mat":
            description = "Calculate the number of k-matchings in G"
            break;
        default:
            description = "Calculate the number of homs from H to G"
    }

    function updateTask(field, value) {
        const newTask = {...task}
        newTask[field] = value
        dispatch(updateTask_({index: taskIndex, task: newTask}));
    }

    function onClickRun() {
        console.log("send task to server for execution");

        const data = {...task}

        axios.post('http://localhost:3000/createTask', {...data}).then((m) => {
            console.log(m)
            const updateData = {
                id: m.data.id,
                status: m.data.status
            }
            dispatch(updateTask_({index: taskIndex, task: updateData}))
        }).catch((error) => {
            console.error(error);
        })
    }

    function onClickStop() {
        console.log("stop task");
    }

    return (
    <Grid container spacing={2}>
        <Grid item size={{xs: 4, sm: 3, lg: 2, xl: 1.5}}>
            <TaskList/>
        </Grid>
        <Divider orientation="vertical" flexItem={true}/>
        <Grid item size={{xs: 7.5, sm: 8.5, lg: 9.5, xl: 10}}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Typography variant="h4" sx={{margin: "16px 32px", textAlign: "center"}}>Task {taskIndex}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {status == "rework" && <Chip icon={<PlayArrowIcon/>} label="Start task" color="success" onClick={onClickRun}/>}
                    {status == "running" && <Chip icon={<StopCircleIcon/>} label="Stop task" color="error" onClick={onClickStop}/>}
                </Box>
                <Divider/>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 3, marginTop: 2}}>
                    <TextField value={status} sx={{width: '100px'}} label="Status"/>
                    <FormControl sx={{width: '200px'}}>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            value={type}
                            onChange={(event) => {updateTask("type",event.target.value)}}
                        >
                            <MenuItem value={"hom"}>Homomorphism</MenuItem>
                            <MenuItem value={"emb"}>Embedding</MenuItem>
                            <MenuItem value={"mat"}>k-Matching</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField value={description} sx={{width: '400px'}} label="Description"/>
                </Box>
                <Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Typography>Graph H</Typography>
                        <IconButton onClick={() => {setOpenH(!openH)}}>{openH ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}</IconButton>
                    </Box>
                    <Box sx={{paddingLeft: 2}}>{openH && <GraphDisplay input={H} setInput={(m) => updateTask("H", m)}/>}</Box>
                </Box>
                <Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Typography>Graph G</Typography>
                        <IconButton onClick={() => {setOpenG(!openG)}}>{openG ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}</IconButton>
                    </Box>
                    <Box sx={{paddingLeft: 2}}>{openG && <GraphDisplay input={G} setInput={(m) => updateTask("G", m)}/>}</Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">G is CFI-Graph:</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={cfi} onChange={() => updateTask("cfi", !cfi)} />}
                        label=""
                    />
                </Box>
                {cfi && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">G is inverted CFI-Graph:</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={invertedCfi} onChange={() => updateTask("invertedCfi", !invertedCfi)} />}
                        label=""
                    />
                </Box>}
                <Divider/>
                <Typography>Result: pending</Typography>
                <Divider/>
            </Box>
        </Grid>
    </Grid>
    )
}