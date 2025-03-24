import React, { useEffect, useRef, useState } from 'react';
import Graph from "react-graph-vis"
import { TextField, Button, Box, Grid2 } from '@mui/material';
import uuid from 'react-uuid';
import { useParams } from 'react-router';

export default function GraphDisplay({input, setInput, editable}) {

    const params = useParams();
    const taskIndex = parseInt(params.taskIndex)

    let [graphKey, setGraphKey] = useState(uuid())
    const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
    const [parserFeedback, setParserFeedback] = useState(parseGraphInput());
    const parserFailed = parserFeedback.status == 'failed'

    //build Graph when new task is accessed
    useEffect(() => {
        buildGraph();
    }, [taskIndex])

    //adjust parser feedback when the input changes
    useEffect(() => {
        setParserFeedback(parseGraphInput())
    }, [input])

    function parseGraphInput() {

        const firstLineWrongFormat = 'First line requires format "graph edge-list <n> <m>"'
        const firstLineStartsWith = 'First line has to begin with "graph edge-list ..."'
        const parameterNisNotANumber = 'The parameter <n> in the first line has to be a number'
        const parameterMisNotANumber = 'The parameter <m> in the first line has to be a number'
        const emptyGraph = 'The graph cannot be empty. At least one node is required'
        const edgeNodeIsBiggerThanN = 'Node number does not represent a vaild node'
        const edgeNodeIsNotANumber = 'Node number is not a valid integer'
        const edgeWrongFormat = 'Edge line requires format <v1> <v2>'

        const parsedData = input.split('\n');
        if(parsedData.length == 0) {
            return {status: 'failed', message: firstLineWrongFormat, line: 1}
        }
        const firstLine = parsedData[0];

        if(!firstLine.startsWith("graph edge-list")) {
            return {status: 'failed', message: firstLineStartsWith, line: 1}
        }

        const splitFirstLine = firstLine.split(" ");

        if(splitFirstLine.length != 4) {
            return {status: 'failed', message: firstLineWrongFormat, line: 1}
        }

        const integerRegex = /^-?\d+$/;

        if(!integerRegex.test(splitFirstLine[2])) {
            return {status: 'failed', message: parameterNisNotANumber, line: 1}
        }

        if(!integerRegex.test(splitFirstLine[3])) {
            return {status: 'failed', message: parameterMisNotANumber, line: 1}
        }

        const n = parseInt(splitFirstLine[2]);
        const m = parseInt(splitFirstLine[3]);

        if(n == 0) {
            return {status: 'failed', message: emptyGraph, line: 1}
        }

        for(let index = 1; index < parsedData.length; index++) {
            const line = index+1;
            const edge = parsedData[index]

            if(edge.split(' ').length != 2) {
                return {status: 'failed', message: edgeWrongFormat, line: line}
            }

            const [from, to] = edge.split(' ');

            if(!integerRegex.test(from)) {
                return {status: 'failed', message: edgeNodeIsNotANumber, line: line}
            }
            if(!integerRegex.test(to)) {
                return {status: 'failed', message: edgeNodeIsNotANumber, line: line}
            }

            const v1 = parseInt(from)
            const v2 = parseInt(to)

            if(v1 >= n) {
                return {status: 'failed', message: edgeNodeIsBiggerThanN, line: line}
            }
            if(v2 >= n) {
                return {status: 'failed', message: edgeNodeIsBiggerThanN, line: line}
            }
        }

        return {status: 'succes'}
    }

    const handleGraphLoad = (network) => {
        // Ensure the graph fits into the container once it's loaded
        network.fit();
    };

    /*
     * demo format:
     * graph adj-list 4 5
     * 0 1
     * 1 2
     * 2 3
     * 3 0
     * 3 1
    */
    const buildGraph = () => {

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
                return false;
            }

            const uniqueNodes = [...new Map(nodes.map((item) => [item.id, item])).values()];

            setGraphKey(uuid())
            setGraphData({
                nodes: uniqueNodes,
                edges: edges,
            });

            return true;

        }catch(error) {
            console.warn(error)
            setGraphData({ nodes: [], edges: [] });
            return false;
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
                    error={parserFailed}
                    helperText={parserFailed && `Line: ${parserFeedback.line} Message: '${parserFeedback.message}'`}
                    disabled={!editable}
                />
                <Button onClick={buildGraph} disabled={parserFailed}>Show Graph</Button>
            </Grid2>
        </Grid2>
    );
};
