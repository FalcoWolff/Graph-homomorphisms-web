import { useParams } from "react-router"
import TaskList from "./TaskList";
import { Box, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormHelperText, Grid2 as Grid, IconButton, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateTask as updateTask_ } from "../../store/tasksSlice";
import GraphDisplay from "./GraphDisplay";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import BuildIcon from '@mui/icons-material/Build';
import axios from "axios";
import staticData from "../../assets/staticData.js";

export default function Task({}) {

    const params = useParams();
    const taskIndex = parseInt(params.taskIndex)
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.value);
    const task = useSelector(state => state.tasks.value[taskIndex])

    const [openG, setOpenG] = useState(true);
    const [openH, setOpenH] = useState(true);

    const [socket, setSocket] = useState();

    const status = task?.status ?? "rework";
    const type = task?.type ?? "hom";
    const cfi = task?.cfi ?? false;
    const invertedCfi = task?.invertedCfi ?? false;
    const G = task?.G ?? "";
    const H = task?.H ?? "";
    const result = task?.result ?? "-"
    const editable = status == "rework";
    const k = task?.k ?? 1;
    let description = "";

    switch(type) {
        case "emb":
            description = staticData.message.embDescription
            break;
        case "mat":
            description = staticData.message.matDescription
            break;
        default:
            description = staticData.message.homDescription
    }

    function applyWebsocketPacket(data) {
        const id = data.id;
        for(let i = 0; i < tasks.length; i++) {
            if(tasks[i].id == id) {
                //found task
                const newData = {...tasks[i], status: data.status, result: data.output}
                console.log(newData)
                dispatch(updateTask_({index: i, task: newData}))
                return true;
            }
        }
        return false;
    }

    //init websocket
    useEffect(() => {
        function connect() {
            const socket = new WebSocket('ws://localhost:3000');
    
            socket.onopen = () => {
                console.log("open websocket connection")
            };
        
            socket.onerror = (error) => {
                console.log("websocket error!")
                console.error(error)
            };
        
            socket.onclose = () => {
                console.log("close websocket connection - reconnect after 3 seconds")
                setTimeout(connect, 3000)
            };
    
            setSocket(socket);
        }

        connect();
    
        return () => {
            if(socket) {
                socket.close();
            }
        };
      }, []);

    //update socket.onmessage
    useEffect(() => {
        if(!socket) return;
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log("websocket received data: " + JSON.stringify(data));
            applyWebsocketPacket(data)
        };
    }, [socket, tasks])

    function updateTask(field, value) {
        const newTask = {...task}
        newTask[field] = value
        dispatch(updateTask_({index: taskIndex, task: newTask}));
    }

    function onClickRun() {
        console.log("send task to server for execution");

        const data = {...task}

        axios.post('http://localhost:3000/createTask', {...data}).then((m) => {
            const id = m.data.id;
            const updateData = {
                id,
                status: m.data.status
            }
            console.log("got response from http://..../createTask -> update Tasks")
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
                    {(status == "completed" || status == "error") && <Chip icon={<BuildIcon/>} label="Rework task" color="info" onClick={onClickStop}/>}
                </Box>
                <Divider/>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 3, marginTop: 2}}>
                    <TextField value={status} sx={{width: '120px'}} label="Status"/>
                    <FormControl sx={{width: '200px'}}>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            value={type}
                            onChange={(event) => {updateTask("type",event.target.value)}}
                            disabled={!editable}
                        >
                            <MenuItem value={"hom"}>Homomorphism</MenuItem>
                            <MenuItem value={"emb"}>Embedding</MenuItem>
                            <MenuItem value={"mat"}>k-Matching</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField value={description} sx={{width: '400px'}} label="Description"/>
                    {type == "mat" && (
                        <FormControl sx={{width: '100px'}}>
                            <InputLabel id="k-label">K</InputLabel>
                            <Select
                                labelId="k-label"
                                value={k}
                                onChange={(event) => {updateTask("k",event.target.value)}}
                                disabled={!editable}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>
                {type != "mat" &&
                <Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Typography>Graph H</Typography>
                        <IconButton onClick={() => {setOpenH(!openH)}}>{openH ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}</IconButton>
                    </Box>
                    <Box sx={{paddingLeft: 2}}>{openH && <GraphDisplay input={H} setInput={(m) => updateTask("H", m)} editable={editable}/>}</Box>
                </Box>
                }
                <Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Typography>Graph G</Typography>
                        <IconButton onClick={() => {setOpenG(!openG)}}>{openG ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}</IconButton>
                    </Box>
                    <Box sx={{paddingLeft: 2}}>{openG && <GraphDisplay input={G} setInput={(m) => updateTask("G", m)} editable={editable}/>}</Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">G is CFI-Graph:</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={cfi} onChange={() => updateTask("cfi", !cfi)} />}
                        label=""
                        disabled={!editable}
                    />
                </Box>
                {cfi && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">G is inverted CFI-Graph:</Typography>
                    <FormControlLabel
                        control={<Checkbox checked={invertedCfi} onChange={() => updateTask("invertedCfi", !invertedCfi)} />}
                        label=""
                        disabled={!editable}
                    />
                </Box>}
                <Divider/>
                <Typography>Result: {result}</Typography>
                <Divider/>
            </Box>
        </Grid>
    </Grid>
    )
}