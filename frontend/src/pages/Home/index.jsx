import { Box, Button, Typography } from "@mui/material";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { insertTask } from "../../store/tasksSlice";

export default function Home({}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function onClickGetStarted() {

        const d = {
            status: 'rework',
            type: 'hom',
            H: 'graph edge-list 3 3\n0 1\n1 2\n2 0',
            G: 'graph edge-list 4 5\n0 1\n1 2\n2 3\n3 0\n3 1',
        }

        dispatch(insertTask(d));

        navigate("/task/0")
    }

    return (
    <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
        <Box>
            <Typography variant="h2">Welcome to Graph-homs-web!</Typography>
            <Button size="large" variant="contained" endIcon={<DoubleArrowIcon/>} onClick={onClickGetStarted}>Get started</Button>
        </Box>
    </Box>
    )
}