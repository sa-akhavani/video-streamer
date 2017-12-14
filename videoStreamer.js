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

function generateContentWithGivenLength (headerRange) {
  let parts = headerRange.replace(/bytes=/, "").split("-");
  return {
    partialstart: parts[0],
    partialend: parts[1],
  };
}


router.get('/:videoName', function (req, res) {
  let videoName = req.params.videoName;
  let path = generateFileFullLocation(videoName);

  let stat = fs.statSync(path);
  let total = stat.size;

  if (req.headers['range']) {
    let range = req.headers.range;
    console.log('range is: ' + range);
    let { partialstart, partialend } = generateContentWithGivenLength(range);
    let start = parseInt(partialstart, 10);
    let end = partialend ? parseInt(partialend, 10) : total - 1;
    let chunksize = (end - start) + 1;
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    let file = fs.createReadStream(path, {
      start: start,
      end: end
    });
    res.writeHead(206, {
      'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
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