import { Router } from 'express';
const router = Router();

import fs from 'fs'
import { join } from 'path';
import { isValid, } from 'ipaddr.js';

module.exports = router

router.get("/length", async (req, res) => {
  const buffer = fs.readFileSync(join(__dirname, '..', '..', 'video.json'))
  res.status(202).send({ length: JSON.parse(buffer.toString()).length });
});

router.get("/log", async (req, res) => {
  const ipAddress = req.header('x-forwarded-for') ||
    req.socket.remoteAddress as string;

  if (isValid(ipAddress)) {
    const logPath = join(__dirname, '..', '..', 'log.json')
    if (fs.existsSync(logPath)) {
      const logsBuffer = fs.readFileSync(logPath)
      let logs: VideoLog[] = logsBuffer.toString() ? JSON.parse(logsBuffer.toString()) : [];
      logs.push({
        id: logs.length,
        createdAt: new Date().toISOString(),
        ip: ipAddress
      })
      fs.writeFileSync(logPath, JSON.stringify(logs))
    }
  }
  res.send("OK")
})

router.get("/all", async (req, res) => {
  const buffer = fs.readFileSync(join(__dirname, '..', '..', 'video.json'))
  const videos: Video[] = JSON.parse(buffer.toString())

  const videoRange = req.headers.range;
  const selectedVideo = videos.find(e => e.id == 1)

  const videoPath = join(__dirname, '..', '..', `assets/${selectedVideo!.name}.mp4`)
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

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const buffer = fs.readFileSync(join(__dirname, '..', '..', 'video.json'))
  const videos: Video[] = JSON.parse(buffer.toString())

  const videoRange = req.headers.range;
  const selectedVideo = videos.find(e => e.id == id)

  const videoPath = join(__dirname, '..', '..', `assets/${selectedVideo!.name}.mp4`)
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

