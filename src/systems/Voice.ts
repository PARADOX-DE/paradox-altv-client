import alt from 'alt-client';
import game from 'natives';

function logDebug(...args: any[]) {
    if(alt.debug) alt.log(`[DEBUG]`, ...args);
}

class Voice {
    webSocket: alt.WebSocketClient;
    everyTick: number;

    constructor() {
        this.everyTick = 0;

        this.webSocket = new alt.WebSocketClient("ws://localhost:3005");
        this.webSocket.on("open", () => {
            logDebug("[VOICE][WEBSOCKET] Connected");
            if(this.everyTick != 0) this.everyTick = alt.everyTick(this.onTick.bind(this));

            this.webSocket.send(JSON.stringify({ method: "joinChannel", data: {
                channel: "Ingame",
                password: "1337",
                username: "187 ist die gang"
            }}));
        });

        this.webSocket.on("close", () => {
            logDebug("[VOICE][WEBSOCKET] Disconnected");
            if(this.everyTick != 0) alt.clearEveryTick(this.everyTick);
        });

        this.webSocket.on("error", err => logDebug("[VOICE][WEBSOCKET] ERROR: " + err));
        this.webSocket.on("message", this.onMessage.bind(this));

        this.webSocket.autoReconnect = true;
        this.webSocket.start();
    }

    onMessage(msg: string) {
        const data: { method: string, data: any } = JSON.parse(msg);
        if(data.method == "talking") {
            const val: boolean = data.data.status;
            logDebug(`[VOICE][WEBSOCKET] ${data.data.name} Talking: ${val}`);
        }
    }

    onTick() {
        const localPlayer = alt.Player.local;
        const range = 50.0;
        let list: { username: string, x: number, y: number, z: number }[] = [];

        for(const player of alt.Player.all) {
            if(player.scriptID == 0 || player.id == localPlayer.id || player.scriptID == localPlayer.scriptID) continue;

            const playerPos = localPlayer.pos;
            const playerRot = game.getGameplayCamRot(2);
            const rotation = Math.PI / 180 * (playerRot.z * -1);

            const streamedPlayerPos = player.pos;
            const subPos = streamedPlayerPos.sub(playerPos.x, playerPos.y, playerPos.z);

            let x = subPos.x * Math.cos(rotation) - subPos.y * Math.sin(rotation);
            let y = subPos.x * Math.sin(rotation) + subPos.y * Math.cos(rotation);

            x *= 10 / range;
            y *= 10 / range;

            list.push({ username: player.name, x, y, z: streamedPlayerPos.z });
        }

        this.webSocket.send(JSON.stringify({ method: "updatePositions", data: list }));
    }
}

export default new Voice();