import alt from 'alt-client';
import game from 'natives';
import util from '../util';

class VehicleRadio {
    constructor() {
        alt.on("streamSyncedMetaChange", this.onStreamSyncedMetaChange.bind(this));
        alt.on("gameEntityCreate", this.onGameEntityCreate.bind(this));
        alt.on("gameEntityDestroy", this.onGameEntityDestroy.bind(this));
    }

    async onGameEntityCreate(entity: alt.Entity) {
        if(!(entity instanceof alt.Vehicle)) return;
        await util.isEntitySpawned(entity);

        if(entity.hasStreamSyncedMeta("HasRadio") && entity.getStreamSyncedMeta("HasRadio") == true) this.startRadio(entity);
    }

    onGameEntityDestroy(entity: alt.Entity) {
        if(!(entity instanceof alt.Vehicle)) return;
        if(entity.hasStreamSyncedMeta("HasRadio") && entity.getStreamSyncedMeta("HasRadio") == true && entity.radioAudio) {
            if(entity.radioAudio) return;

            const radioClass: alt.Audio = entity.radioAudio;
            radioClass.destroy();
        }
    }

    onStreamSyncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any) {
        if(!(entity instanceof alt.Vehicle)) return;
        if(key == "HasRadio") {
            const isRadioOn: boolean = value;

            if(isRadioOn) this.startRadio(entity);
            else this.stopRadio(entity);
        }
    }

    startRadio(vehicle: alt.Vehicle) {
        if(vehicle.radioAudio) return;

        vehicle.radioAudio = new alt.Audio("https://stream.retrosounds.co/paradoxrp.ogg", 0.5, "radio", false);
        vehicle.radioAudio.addOutput(vehicle);
        vehicle.radioAudio.play();
    }

    stopRadio(vehicle: alt.Vehicle) {
        if(!vehicle.radioAudio) return;

        vehicle.radioAudio.destroy();
        vehicle.radioAudio = undefined;
    }
}

export default new VehicleRadio();