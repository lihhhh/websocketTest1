const path = require('path')
const express = require('express')
const _cookie = require('cookie');
var bodyParser = require('body-parser');

module.exports = function (app, wss) {
    wss.on('connection', function connection(ws, req) {
        ws.req = req;
        ws.sendJson = function (json) {
            if (this.readyState == 1) {
                this.send(JSON.stringify(json))
            }
        }
        ws.on('message', function (message) {
            message = JSON.parse(message);
            switch (message.type) {
                case 'setSocketId':
                    ws.socketId = message.data;
                    console.log(ws.socketId)
                    break;
            }
        });
    });

    // parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))

	// parse application/json
	app.use(bodyParser.json())

    app.use(function (req, res, next) {
        res.wss = wss;
        res.header('Access-Control-Allow-Origin', '*');//
        res.header('Access-Control-Allow-Headers', '*');//
        next();
    })

    app.use(function (req, res, next) {
		try {
			req.cookies = _cookie.parse(req.headers.cookie || '');
		} catch (e) { }

		next();
	})

    app.get('/', function (req, res) {
        res.sendfile(path.join(__dirname, '../src/index.html'))
    })

    app.get('/api/server/config', function (req, res) {
        res.send({
            code: 0,
            data: {
                row: global.config
            }
        })
    })


    app.post('/api/socket/msg', function (req, res) {
        var query = req.body;
        console.log(query)

        var socketId = req.cookies.socketId;

        res.wss.clients.forEach(ws => {
            if (ws.socketId == socketId && ws.readyState == 1) {
                ws.sendJson({
                    type:'testMsg',
                    data:query.msg
                });
                setInterval(()=>{
                    ws.sendJson({
                        type:'testMsg',
                        data:query.msg
                    });
                },1000)
            }
        })

        res.send({})
    })

    app.use(express.static(path.join(__dirname, '../src')))
}