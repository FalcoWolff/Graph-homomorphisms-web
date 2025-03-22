import {appendFileSync} from 'fs';

function storeGraph(file, graph) {
    const n = graph.numNodes;
    const edges = graph.edges;

    try {
        appendFileSync(file, `graph adj-list ${n} ${edges.length}\n`);
        
        for(const edge of edges) {
            appendFileSync(file, edge + "\n");
        }
    } catch (err) {
        console.error('Error appending to file:', err);
        return false;
    }

    return true;
}

export {storeGraph};