


if (!Cookies.get('socketId')) {
    // 这里为模拟生成唯一id  建议  require('uuid')
    var uuid = Math.random() * 1000;
    Cookies.set('socketId', uuid)
}

async function connectWebsocket() {
    let res = await getRemoteConfig()
    let data = res.data.data.row;
    let url = `ws://${data.remoteIp}:${data.remotePort}`;

    var connect = function () {
        var ws = new WebSocket(url);

        ws.onopen = function () {
            console.log("连接成功!");
            ws.send(
                JSON.stringify({
                    type: "setSocketId",
                    data: Cookies.get('socketId')
                })
            );
        };
        ws.onclose = function () {
            // 关闭 websocket
            console.log("连接已关闭...正在重连...");
            connect()
        };
        ws.onmessage = res => {
            console.log("收到socket消息:", res.data)
            var data = JSON.parse(res.data)
            document.querySelector('#content').innerHTML = data.data;
        };
    }

    connect()
}

connectWebsocket()


function getRemoteConfig() {
    return axios.get('/api/server/config')
}

document.querySelector('button').onclick = function(){
    axios({
        url:'/api/socket/msg',
        method:'POST',
        data:{
            msg:'你好'
        }
    })
}
