import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http'
import dotenv from 'dotenv';
import { log } from './utils/config';
import { initialConnection } from './utils/mysql';
import { join } from 'path';
import { expressjwt } from 'express-jwt'
import fs from 'fs'

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT
app.use(cors());
app.use(bodyParser.json())

app.use(express.static(join(__dirname, '../app/client/dist'))).use(
    expressjwt({
        secret: process.env.SECRET_KEY!,
        algorithms: ["HS256"],
    }).unless({
        path: [
        ]
    })
).use((err: any, req: Request, res: Response, next: NextFunction) => {
    log.info(`${req.method} ${req.path} `)
    if (err.name === "UnauthorizedError") {
        res.status(err.status).send("Unauthorized access!");
        return;
    }
    next();
});

app.get('/', async (res: Response) => {
    res.sendFile(join(__dirname, '../app/client/dist/index.html'));
})

app.get('/admin', async (res: Response) => {
    res.sendFile(join(__dirname, '../app/admin/dist/index.html'));
})

app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    const videoPath = "Doritos Loaded TV Commercial - 30 second.mp4";
    const videoSize = fs.statSync("Doritos Loaded TV Commercial - 30 second.mp4").size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range?.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

createServer(app).listen(port, () => {
    // initialConnection()
    console.log(`Server listening on port http://localhost:${port}`)
});