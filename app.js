var express = require('express');
var app = express();
var path = require('path')
var browserify = require('browserify-middleware')

const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

// open livereload high port and start to watch public directory for changes
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

// ping browser on Express boot, once browser has reconnected and handshaken
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100); 
}); 

app.use('/js', browserify('./js'))

// monkey patch every served HTML so they know of changes
app.use(connectLivereload());

app.use(express.static(path.join(__dirname, 'public')))
app.listen(3000)
console.log('http://localhost:3000/')