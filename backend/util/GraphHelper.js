import {appendFileSync} from 'fs';

function storeGraph(file, graph) {

    appendFileSync(file, graph);

    return true;
}

export {storeGraph};