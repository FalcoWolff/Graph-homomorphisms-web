import WebSocket, {WebSocketServer} from 'ws';
import express from 'express';
import { spawn } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { storeGraph } from './util/GraphHelper.js';
import path from 'path';
import cors from 'cors'

const cProgramPath = "/home/falco/coding/vscode/projects/Graph-homomorphisms/cmake-build-release/Graph_homomorphisms";

const expressPort = 3000;
const websocketPort = 3001;

const wss = new WebSocketServer({ port: websocketPort });
let wsClients = [];//store the active ws clients

wss.on('connection', (ws) => {
  console.log('Client connected');
  wsClients.push(ws)

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    wsClients = wsClients.filter(client => client !== ws);
  });
});

console.log(`WebSocket server running on ws://localhost:${websocketPort}`);

const app = express();

// Middleware to handle WebSocket upgrade
app.server = app.listen(expressPort, () => {
    console.log(`REST API server running on http://localhost:${expressPort}`);
});

app.server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.use(express.json()); //to parse JSON bodies

app.use(cors())

let nextTaskId = 0;

app.post('/createTask', (req, res) => {
    let taskId = nextTaskId;
    nextTaskId++;
    console.log('Received task create request ' + taskId);

    const data = req.body;
    console.log(data);
    const type = data.type;
    console.log("type: " + type);

    const taskFolder = "./tasks/task_" + taskId

    if (existsSync(taskFolder)) {
        rmSync(taskFolder, { recursive: true, force: true });
    }

    mkdirSync(taskFolder);

    let params = [];

    if(type == "hom") {
        const G = data.G ?? ""
        const H = data.H ?? ""
        const Gfile = path.resolve(taskFolder + "/Graph_G.txt");
        const Hfile = path.resolve(taskFolder + "/Graph_H.txt");
        storeGraph(Gfile, G);
        storeGraph(Hfile, H);

        params.push("hom")
        params.push(Hfile)
        params.push(Gfile)

        if(data.cfi) {
            params.push("--cfi");
        }
    }else if(type == "emb") {
        const G = data.G ?? ""
        const H = data.H ?? ""
        const Gfile = path.resolve(taskFolder + "/Graph_G.txt");
        const Hfile = path.resolve(taskFolder + "/Graph_H.txt");
        storeGraph(Gfile, G);
        storeGraph(Hfile, H);

        params.push("emb")
        params.push(Hfile)
        params.push(Gfile)

        if(data.cfi) {
            params.push("--cfi");
        }
    }else if(type == "mat") {
        const G = data.G ?? ""
        const k = parseInt(data.k) || 1
        const Gfile = path.resolve(taskFolder + "/Graph_G.txt");
        storeGraph(Gfile, G);

        params.push("mat")
        params.push(k)
        params.push(Gfile)

        if(data.cfi) {
            params.push("--cfi");
        }
    }

    // Start the task (spawning the C program)
    const cProgram = spawn(cProgramPath, params);
    let output = '';

    cProgram.stdout.on('data', (data) => {
        output += data.toString(); // Capture the output
    });

    cProgram.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        output += data.toString();
    });

    cProgram.on('close', (code) => {
        console.log(`C program finished with code ${code} and output: ${output}`);

        const message = {
            id: taskId,
            status: 'completed',
            output: output,
            exitCode: code,
        };

        if(code != 0) {
            message.status = 'error'
        }

        //notify all clients about the task completion
        setTimeout(() => {
            wsClients.forEach((client) => {
                client.send(JSON.stringify(message));
            });
        }, 3000)
    });

    cProgram.on('error', (err) => {
        console.error(`Error: ${err.message}`);

        //notify all clients about the error
        const errorMessage = {
            id: taskId,
            status: 'error',
            output: err.message,
        };

        setTimeout(() => {
            wsClients.forEach((client) => {
                client.send(JSON.stringify(errorMessage));
            });
        }, 3000)
    });

    res.json({
        id: taskId,
        status: 'running',
    });
});
