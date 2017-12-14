'use strict';
const express = require('express');
const fs = require('fs');
const http = require('http');
const util = require('util');
const configs = require('./config.json');
const router = express.Router();

function fetchFileSize(filePath) {
  let stat = fs.statSync(filePath);
  return stat.size;
}

function generateFileFullLocation(videoFileNameAndFormat) {
  return configs.VIDEOS_DIRECTORY + videoFileNameAndFormat;
}

function generateIndexesWithGivenLength(headerRange, totalSize) {
  let parts = headerRange.replace(/bytes=/, "").split("-");
  let start = parseInt(parts[0], 10);
  let end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
  let chunkSize = (end - start) + 1
  // console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunkSize);
  return {
    start: start,
    end: end,
    chunkSize: chunkSize
  };
}


router.get('/:videoName', function (req, res) {
  let videoName = req.params.videoName;
  let path = generateFileFullLocation(videoName);
  let totalSize = fetchFileSize(path);

  if (req.headers['range']) {
    let range = req.headers.range;
    let { start, end, chunkSize } = generateIndexesWithGivenLength(range, totalSize);
    let file = fs.createReadStream(path, {
      start: start,
      end: end
    });
    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + totalSize,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    file.pipe(res);

  } else {
    // console.log('No Request Header - Serving Whole Video With Total Size: ' + totalSize);  
    res.writeHead(200, {
      'Content-Length': totalSize,
      'Content-Type': 'video/mp4'
    });
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;