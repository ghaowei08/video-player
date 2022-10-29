import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createServer } from 'http'
import { join } from 'path';
import { expressjwt } from 'express-jwt'
import { log } from './utils/config';

import fs from 'fs'

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT
app.use(cors());
app.use(bodyParser.json())

app.use(express.static(join(__dirname, '../app/client/dist')))
// .use(
//     expressjwt({
//         secret: process.env.SECRET_KEY!,
//         algorithms: ["HS256"],
//     }).unless({
//         path: [
//             "/video"
//         ]
//     })
// ).use((err: any, req: Request, res: Response, next: NextFunction) => {
//     log.info(`${req.method} ${req.path} `)
//     if (err.name === "UnauthorizedError") {
//         res.status(err.status).send("Unauthorized access!");
//         return;
//     }
//     next();
// });

app.get('/', async (res: Response) => {
    res.sendFile(join(__dirname, '../app/client/dist/index.html'));
})

app.get('/admin', async (res: Response) => {
    res.sendFile(join(__dirname, '../app/admin/dist/index.html'));
})

app.get('/test', (req, res) => {
    const data = fs.readFileSync(join(__dirname, '../video.json'))
    res.send(data)
})

app.get("/video", async (req, res) => {
    const videoRange = req.headers.range;
    const videoPath = join(__dirname, "../assets/Doritos Loaded TV Commercial - 30 second.mp4")
    const videoSize = fs.statSync(videoPath).size;

    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : videoSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
            'Content-Length': videoSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
});

createServer(app).listen(port, async () => {
    console.log(`Server listening on port http://localhost:${port}`)
});