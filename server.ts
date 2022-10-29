import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createServer } from 'http'
import { expressjwt } from 'express-jwt'
import { log } from './utils/config';
import { join } from 'path';


dotenv.config();

const path_joined_index = join(__dirname, '..', 'client/dist/index.html')
const app: Express = express();
const port = process.env.APP_PORT
app.use(cors());
app.use(bodyParser.json())

app.use(express.static(join(__dirname, '..', 'client/dist')))
app.use(express.static(join(__dirname, '..', 'assets')))
// .use(
//     expressjwt({
//         secret: process.env.SECRET_KEY!,
//         algorithms: ["HS256"],
//     }).unless({
//         path: [
//             "/video"
//         ]
//     })
// )
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    log.info(`${req.method} ${req.path} `)
    if (err.name === "UnauthorizedError") {
        res.status(err.status).send("Unauthorized access!");
        return;
    }
    next();
});

app.use('/api/video', require('./routers/video'))

app.get("*", (req, res) => {
    res.sendFile(path_joined_index);
});

createServer(app).listen(port, async () => {
    console.log(`Server listening on port http://localhost:${port}`)
});