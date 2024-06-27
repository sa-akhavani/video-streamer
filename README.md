# Node.js Video File Streamer
A Node js Video Streamer Which Uses Express Web Server And Raw HTTP Methods And Headers To Serve Videos.

The `server` is responsible for streaming the video.
It contains two files.
- `app.js` launches a simple http server.
- `videoStreamer.js` is the core file that contains the API and the code that streams the video.

The `client` is just a simple html page that casts the video for testing.


## Server:

### Running the server:

```bash
# Installing dependencies
npm install

# Running the server
node ./server/app.js
```

### Changing the default config:
Config file is located in `./server/config`
- Adding a video file to the server:
    - Add the file to the `./server/video/` directory, or change the config file to use another directory for your video source.
- Change server listening port:
    - Default port is `8583`. You can change it by editing the config file.


## Testing the setup:
After running the server, send a `Get` Request to:
`http://localhost:<config.PORT>/:videoName`

Or just open the `./client/client.html` file in your browser

```bash
# Run the server using
node ./server/app.js

# Open browser and type this in the url:
http://localhost:8583/stream/example.mp4

# OR open the ./client/client.html file
```



---
Written By: Seyed Ali Akhvani
