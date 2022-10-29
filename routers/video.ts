import { Router } from 'express';
const router = Router();

import fs from 'fs'
import { join } from 'path';
import { Video } from '../models/video.interface';

module.exports = router

router.get("/length", async (req, res) => {
  const buffer = fs.readFileSync(join(__dirname, '..', '..', 'video.json'))
  res.status(202).send({ length: JSON.parse(buffer.toString()).length });
});

router.get("/log", async (req, res) => {
  const ipAddress = req.header('x-forwarded-for') ||
    req.socket.remoteAddress;
  console.log(ipAddress)

  var split_str = ipAddress!.split(':');
  const value = split_str[6] + split_str[7];
  console.log('Value', value)
  var ip_1 = ~parseInt(value.substring(0, 2), 16) & 0xFF;
  var ip_2 = ~parseInt(value.substring(2, 4), 16) & 0xFF;
  var ip_3 = ~parseInt(value.substring(4, 6), 16) & 0xFF;
  var ip_4 = ~parseInt(value.substring(6, 8), 16) & 0xFF;

  console.log(ip_1, ip_2, ip_3, ip_4)
  res.send("OK")
})

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


router.get("/videos", async (req, res) => {
  const buffer = fs.readFileSync(join(__dirname, '../video.json'))
  const videos: Video[] = JSON.parse(buffer.toString())
  // const rnd: number = Math.floor(Math.random() * 5);

  const videoRange = req.headers.range;
  const videoPath = join(__dirname, `../assets/${videos[0]!.name}.mp4`)
  const videoSize = fs.statSync(videoPath).size;

  if (videoRange) {
    console.log(`Video Range -- ${videoRange}`)
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

