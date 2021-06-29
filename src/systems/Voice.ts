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
        } else if(data.method == "Connected") {
            this.send({ method: "joinChannel", data: {
                channel: "Ingame",
                password: "1337",
                username: alt.Player.local.name
            }});
        }
    }

    onTick() {
        const localPlayer = alt.Player.local;
        const list: { name: string, x: number, y: number, z: number, distance: number, voiceRange: number, volumeModifier: number }[] = [];
        const rotation = game.getGameplayCamRot(2).z;
        const range = 50;

        const fakePlayer = [
            { 
                id: localPlayer.id,
                scriptID: localPlayer.scriptID,
                pos: localPlayer.pos,
                name: "Nova1"
            },
            {
                id: 25,
                scriptID: 50,
                pos: new alt.Vector3(150.94, -1037.47, 29.37),
                name: "Nova2"
            }
        ];

        try {
            for(const target of alt.Player.all) {
            //for(const target of fakePlayer) {
                if(target.scriptID == 0 || target.id == localPlayer.id) continue;
    
                const targetPos = target.pos;
                const distance = localPlayer.pos.distanceTo({ x: targetPos.x, y: targetPos.y, z: targetPos.z });
                if(distance > range) continue;
    
                let volumeModifier = 0;
                if(distance > 5) volumeModifier = (distance * 35 / 10);
                if(volumeModifier > 0) volumeModifier = 0;

                const subPos = targetPos.sub({ x: localPlayer.pos.x, y: localPlayer.pos.y, z: localPlayer.pos.z });
                const x = (subPos.x * Math.cos(rotation) - subPos.y * Math.sin(rotation)) * 10 / range;
                const y = (subPos.x * Math.sin(rotation) + subPos.y * Math.cos(rotation)) * 10 / range;
                
                list.push({ name: target.name, x: x, y: y, z: 0, distance: distance, voiceRange: 50, volumeModifier: volumeModifier });
            }
        } catch(err) {
            logDebug(`[PARADOX][WEBSOCKET] onTick error: ${err}`);
        }
        
        this.send({ method: "updateTargetPositions", data: list });
    }

    send(data: any) {
        if(typeof data == "string") this.webSocket.send(data);
        else this.webSocket.send(JSON.stringify(data));
    }
}

export default new Voice();