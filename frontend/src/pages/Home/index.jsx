import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from "@mui/material";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { insertTask } from "../../store/tasksSlice";
import uuid from "react-uuid";
import randomIntFromInterval from "../../util/randomIntFromInterval";
import { useEffect, useState } from "react";
import Graph from "react-graph-vis"

export default function Home({}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tasks = useSelector(state => state.tasks.value);

    let [graphKey, setGraphKey] = useState(uuid())
    const [graph, setGraph] = useState({nodes: [], edges: []})

    function onClickGetStarted() {

        if(tasks.length == 0) {
            const d = {
                status: 'rework',
                type: 'hom',
                H: 'graph edge-list 3 3\n0 1\n1 2\n2 0',
                G: 'graph edge-list 4 5\n0 1\n1 2\n2 3\n3 0\n3 1',
            }

            dispatch(insertTask(d));
        }

        navigate("/task/0")
    }

    function generateRandomGraph() {
        const nodes = []
        const edges = []

        const n = randomIntFromInterval(20, 100);
        let m = randomIntFromInterval(1,5*n, 2*n);//m is only an upper bound its very likely that the number of edges is significant smaller than m

        for(let i = 0; i < n; i++) {
            nodes.push({id: i, label: i});
        }

        const degree = new Array(n).fill(0);

        //ensure connectivity
        for(let node = 1; node < n; node++) {
            
            let node2;

            //search node2
            do {
                node2 = randomIntFromInterval(0, node-1);
            }while(degree[node2] >= 3)

            console.log(node, node2)

            degree[node] = degree[node] + 1;
            degree[node2] = degree[node2] + 1

            edges.push({from: node, to: node2})
        }

        m = m - (n-1)

        for(let i = 0; i < m; i++) {

            const v1 = randomIntFromInterval(0, n-1);
            const v2 = randomIntFromInterval(0, n-1);

            console.log(degree[v1], degree[v2])

            //when the edge pairs does not match the conditions we skip this edge thus leading to less than m edges (its for performance reasons)
            if(degree[v1] >= 3 || degree[v2] >= 3) {
                continue;
            }

            if(v1 == v2) {
                continue;
            }

            degree[v1] = degree[v1] + 1;
            degree[v2] = degree[v2] + 1;

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
        height: '700px',
        interaction: {
            zoomView: false
        }

    };

    return (
        <>
        <div style={{position: 'relative', height: '90vh'}}>
            <Box sx={{display: 'flex', justifyContent: 'center', zIndex: 5, position: 'relative', marginTop: 8, marginBottom: 2}}>
                <Box>
                    <Typography variant="h2">Welcome to Graph-homs-web!</Typography>
                    <Button size="large" variant="contained" endIcon={<DoubleArrowIcon/>} onClick={onClickGetStarted}>Get started</Button>
                </Box>
            </Box>
            <Graph graph={graph} options={options} key={graphKey}/>
        </div>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Box sx={{ width: '50%'}}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="about-content"
                        id="about-header"
                    >
                        <Typography variant="h6">About</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Uni Project to work with homomorphisms of Graphs and CFI Graphs.<br/>
                            We also included embedings and k-matchings (up to k=9).
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="faq-content"
                        id="faq-header"
                    >
                        <Typography variant="h6">FAQ</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            What is the correct format for entering a Graph?<br/>
                            Answer:<br/>
                            What are CFI Graphs?<br/>
                            Answer: <br/>
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                {/* Add more sections like this */}
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="contact-content"
                        id="contact-header"
                    >
                        <Typography variant="h6">Contact</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            -
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
        </>
    )
}