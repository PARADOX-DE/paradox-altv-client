import alt from 'alt-client';

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
            if(this.everyTick == 0) this.everyTick = alt.everyTick(this.onTick.bind(this));

            this.send({ method: "joinChannel", data: {
                channel: "Ingame",
                password: "1337",
                username: alt.Player.local.name
            }});
        });

        this.webSocket.on("close", () => {
            logDebug("[VOICE][WEBSOCKET] Disconnected");

            if(this.everyTick != 0) {
                alt.clearEveryTick(this.everyTick);
                this.everyTick = 0;
            }
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
        this.send({ method: "updatePlayerPosition", data: { x: localPlayer.pos.x, y: localPlayer.pos.y, z: localPlayer.pos.z } });

        for(const target of alt.Player.all) {
            if(target.scriptID == 0 || target.id == localPlayer.id) continue;

            const targetPos = target.pos;
            const distance = targetPos.distanceTo(localPlayer.pos);
            if(distance >= 50) continue;
            
            this.send({ method: "updateTargetPosition", data: { name: localPlayer.name, x: targetPos.x, y: targetPos.y, z: targetPos.z } });
        }
    }

    send(data: any) {
        if(typeof data == "string") this.webSocket.send(data);
        else this.webSocket.send(JSON.stringify(data));
    }
}

export default new Voice();