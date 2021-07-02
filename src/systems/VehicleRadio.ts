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

        if(entity.hasStreamSyncedMeta("HasRadio") && entity.getStreamSyncedMeta("HasRadio") == true) {
            if(entity.hasMeta("RadioClass")) entity.deleteMeta("RadioClass");
            
            this.startRadio(entity);
        }
    }

    onGameEntityDestroy(entity: alt.Entity) {
        if(!(entity instanceof alt.Vehicle)) return;
        if(entity.hasStreamSyncedMeta("HasRadio") && entity.getStreamSyncedMeta("HasRadio") == true && entity.hasMeta("RadioClass")) {
            if(entity.getMeta("RadioClass") == null || entity.getMeta("RadioClass") == undefined) return;

            const radioClass: alt.Audio = entity.getMeta("RadioClass");
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
        if(vehicle.hasMeta("RadioClass")) return;

        const radioClass = new alt.Audio("https://stream.retrosounds.co/paradoxrp.ogg", 0.5, "radio", false);
        radioClass.addOutput(vehicle);
        radioClass.play();

        vehicle.setMeta("RadioClass", radioClass);
    }

    stopRadio(vehicle: alt.Vehicle) {
        if(!vehicle.hasMeta("RadioClass")) return;
        const radioClass: alt.Audio = vehicle.getMeta("RadioClass");

        radioClass.destroy();
        vehicle.deleteMeta("RadioClass");
    }
}

export default new VehicleRadio();