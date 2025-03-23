import React, { useEffect, useRef, useState } from 'react';
import Graph from "react-graph-vis"
import { TextField, Button, Box, Grid2 } from '@mui/material';
import uuid from 'react-uuid';

export default function GraphDisplay({input, setInput}) {

    let [graphKey, setGraphKey] = useState(uuid())
    const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

    const handleGraphLoad = (network) => {
        // Ensure the graph fits into the container once it's loaded
        network.fit();
    };

    /*
    demo format:
    graph adj-list 4 5
    0 1
    1 2
    2 3
    3 0
    3 1
    */
    const handleGraphInput = () => {
        console.log("calc graph")

        try {
            const edges = [];
            const nodes = [];

            const parsedData = input.split('\n');
            const firstLine = parsedData[0];

            if(firstLine.startsWith("graph edge-list")) {

                const splitFirstLine = firstLine.split(" ");
                const n = parseInt(splitFirstLine[2]);
                const m = parseInt(splitFirstLine[3]);

                for(let i = 0; i < n; i++) {
                    nodes.push({id: i, label: `${i}`})
                }

                parsedData.slice(1).forEach((edge) => {
                    const [from, to] = edge.split(' ');
                    edges.push({ from: parseInt(from), to: parseInt(to) });
                });
            }else {
                throw "unknown format";
            }

            console.log(nodes)
            console.log(edges)

            const uniqueNodes = [...new Map(nodes.map((item) => [item.id, item])).values()];

            setGraphKey(uuid())
            setGraphData({
                nodes: uniqueNodes,
                edges: edges,
            });
            

        }catch(error) {
            console.warn(error)
        }
    };

    const options = {
        layout: {
        hierarchical: false,
        },
        edges: {
        smooth: true,
        },
        height: '500px',
    };

    return (
        <Grid2 container gap={4}>
            <Grid2 item size={8} sx={{border: "1px solid lightgrey", borderRadius: "8px"}}>
                <Graph graph={graphData} options={options} key={graphKey} events={{ load: handleGraphLoad }}/>
            </Grid2>
            <Grid2 item size={3}>
                <TextField
                    label="Enter Graph"
                    variant="outlined"
                    multiline={true}
                    rows={12}
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{width: '300px'}}
                />
                <Button onClick={handleGraphInput}>Show Graph</Button>
            </Grid2>
        </Grid2>
    );
};
