'use strict';
const express = require('express');
const fs = require('fs');
const http = require('http');
const util = require('util');
const configs = require('./config.json');
const router = express.Router();

function generateFileFullLocation (videoFileNameAndFormat) {
  return configs.VIDEOS_DIRECTORY + videoFileNameAndFormat;
}

function generateIndexesWithGivenLength (headerRange, totalSize) {
  let parts = headerRange.replace(/bytes=/, "").split("-");
  let start = parseInt(parts[0], 10);
  let end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
  console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunkSize);
  return {
    start: start,
    end: end,
    chunkSize: (end - start) + 1
  };
}


router.get('/:videoName', function (req, res) {
  let videoName = req.params.videoName;
  let path = generateFileFullLocation(videoName);

  let stat = fs.statSync(path);
  let total = stat.size;

  if (req.headers['range']) {
    let range = req.headers.range;
    let { start, end, chunkSize} = generateIndexesWithGivenLength(range, total);
    let file = fs.createReadStream(path, {
      start: start,
      end: end
    });
    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    file.pipe(res);
  } else {
    console.log('ALL: ' + total);
    res.writeHead(200, {
      'Content-Length': total,
      'Content-Type': 'video/mp4'
    });
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;