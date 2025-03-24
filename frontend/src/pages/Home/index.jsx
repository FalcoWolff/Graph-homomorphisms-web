import { Box, Button, Typography } from "@mui/material";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { insertTask } from "../../store/tasksSlice";
import uuid from "react-uuid";
import randomIntFromInterval from "../../util/randomIntFromInterval";
import { useEffect, useState } from "react";
import Graph from "react-graph-vis"

export default function Home({}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    let [graphKey, setGraphKey] = useState(uuid())
    const [graph, setGraph] = useState({nodes: [], edges: []})

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

    function generateRandomGraph() {
        const nodes = []
        const edges = []

        const n = randomIntFromInterval(20, 100);
        const m = randomIntFromInterval(n, 2.5*n);

        for(let i = 0; i < n; i++) {
            nodes.push({id: i, label: i});
        }

        for(let i = 0; i < m; i++) {
            const v1 = randomIntFromInterval(0, n-1);
            const v2 = randomIntFromInterval(0, n-1);

            if(v1 == v2) {
                i--;
                continue;
            }

            edges.push({from: v1, to: v2})
        }

        setGraph({nodes, edges})
        setGraphKey(uuid())
    }

    useEffect(() => {
        generateRandomGraph();
    }, [])

    const options = {
        autoResize: true,
        layout: {
            hierarchical: false,
        },
        edges: {
            smooth: true,
        },
        height: '800px',
        interaction: {
            zoomView: false
        }

    };

    return (
        <div style={{position: 'relative', height: '90vh'}}>
            <Box sx={{display: 'flex', justifyContent: 'center', zIndex: 5, position: 'relative', marginTop: 8}}>
                <Box>
                    <Typography variant="h2">Welcome to Graph-homs-web!</Typography>
                    <Button size="large" variant="contained" endIcon={<DoubleArrowIcon/>} onClick={onClickGetStarted}>Get started</Button>
                </Box>
            </Box>
            <Graph graph={graph} options={options} key={graphKey}/>
        </div>
    )
}