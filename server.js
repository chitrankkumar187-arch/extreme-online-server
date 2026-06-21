const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("EXTREME ONLINE SERVER");
});

const wss = new WebSocket.Server({ server });

let players = {};

wss.on("connection", (ws) => {

    const id = Date.now().toString();

    players[id] = {
        x: 0,
        y: 0,
        z: 0
    };

    ws.send(JSON.stringify({
        type: "id",
        id: id
    }));

    console.log("Player connected:", id);

    ws.on("message", (message) => {

        try {

            const data = JSON.parse(message);

            if (data.type === "move") {

                players[id].x = data.x;
                players[id].y = data.y;
                players[id].z = data.z;

                console.log(
                    id,
                    data.x,
                    data.y,
                    data.z
                );
            }

        } catch (err) {
            console.log(err);
        }

    });

    ws.on("close", () => {

        delete players[id];

        console.log("Player disconnected:", id);

    });

});

setInterval(() => {

    const packet = JSON.stringify({
        type: "players",
        players: players
    });

    wss.clients.forEach(client => {

        if (client.readyState === WebSocket.OPEN) {
            client.send(packet);
        }

    });

}, 100);

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port", PORT);
});
