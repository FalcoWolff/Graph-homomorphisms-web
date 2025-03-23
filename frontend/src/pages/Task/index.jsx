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

export default function Task({}) {

    const params = useParams();
    const taskId = parseInt(params.taskId)
    const dispatch = useDispatch();
    const task = (useSelector(state => state.tasks.value)).find(e => e.id == taskId);

    const [openG, setOpenG] = useState(true);
    const [openH, setOpenH] = useState(true);

    const status = task?.status ?? "rework";
    const type = task?.type ?? "hom";
    const cfi = task?.cfi ?? false;
    const G = task?.G;
    const H = task?.H;
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
        dispatch(updateTask_({id: taskId, task: newTask}));
    }

    function onClickRun() {
        console.log("send task to server for execution");
    }

    return (
    <Grid container spacing={2}>
        <Grid item size={{xs: 4, sm: 3, lg: 2, xl: 1.5}}>
            <TaskList/>
        </Grid>
        <Divider orientation="vertical" flexItem={true}/>
        <Grid item size={{xs: 7.5, sm: 8.5, lg: 9.5, xl: 10}}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Typography variant="h4" sx={{margin: "16px 32px", textAlign: "center"}}>Task {taskId}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Chip icon={<PlayArrowIcon/>} label="Start task" color="success" onClick={onClickRun}/>
                </Box>
                <Divider/>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 3, marginTop: 2}}>
                    <TextField value={status} sx={{width: '80px'}} label="Status"/>
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
                <Divider/>
                <Typography>Result: pending</Typography>
                <Divider/>
            </Box>
        </Grid>
    </Grid>
    )
}