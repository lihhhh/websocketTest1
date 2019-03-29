var express = require('express');
var app = express();
const WebSocket = require('ws');
var server = require('http').Server(app);
var { getIPAdress } = require('./lib/utils')
const wss = new WebSocket.Server({ server: server });

var PORT = process.env.NODE_ENV == 'production' ? process.env.PORT : 8883;



require('./router.js')(app, wss, server);

global.config = {
    remoteIp: getIPAdress(),
    remotePort: PORT
}

server.listen(PORT, function () {
    console.log('http://localhost:'+PORT);
})


