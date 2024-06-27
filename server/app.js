const express = require('express');
const bodyParser = require('body-parser');
const videoApp = require('./videoStreamer');

const configs = require('./config.json');
let app = express();

app.use(bodyParser.json());
app.listen(configs.PORT, function () {
  console.log('Video Streamer is listening on port: ' + configs.PORT);
});
app.use('/stream', videoApp);