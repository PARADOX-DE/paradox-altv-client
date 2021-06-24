import alt from 'alt-client';
import game from 'natives';
import EventController from '../controllers/EventController';

class Flatbed {
    towTrucksInStreamingRange: number[];
    flatbedHash: number;

    constructor() {
        this.towTrucksInStreamingRange = [];
        this.flatbedHash = alt.hash("flatbed");

        EventController.onServer("Flatbed::Attach", this.attachToFlatbed.bind(this));
        EventController.onServer("Flatbed::Detach", this.deatchFromFlatBed.bind(this));
        
        alt.on("Flatbed::Attach", this.attachToFlatbed.bind(this));
        alt.on("Flatbed::Detach", this.deatchFromFlatBed.bind(this));

        alt.on('gameEntityCreate', this.onEntityStreamIn.bind(this));
        alt.on('gameEntityDestroy', this.onEntityStreamOut.bind(this));

        alt.on("keydown", key => {
            if(key != 192) return;

            if(alt.Player.local.vehicle) this.attachToFlatbed(alt.Player.local.vehicle.id, this.towTrucksInStreamingRange[0]);
        });

        alt.setInterval(this.reattachTowedVehicles.bind(this), 2000);
    }

    reattachTowedVehicles() {
        for(const towTruckId of this.towTrucksInStreamingRange) {
            let towTruck = alt.Vehicle.getByID(towTruckId);
            if (!towTruck) return;

            if (towTruck.hasStreamSyncedMeta("TowedVehicle")) {
                let towedVehilceId = towTruck.getStreamSyncedMeta("TowedVehicle");
                if (towedVehilceId == null) return;

                let towedVehicle = alt.Vehicle.getByID(towedVehilceId);
                if(!towedVehicle || towedVehicle.scriptID == 0 || !towedVehicle.hasStreamSyncedMeta("TowedByVehicle")) continue;
                if(towedVehicle.getStreamSyncedMeta("TowedByVehicle") === towTruck.id) this.attachToFlatbed(towedVehicle.id, towTruck.id);
            }
        }
    }

    onEntityStreamIn(entity: alt.Entity) {
        if (entity instanceof alt.Vehicle && entity.model == this.flatbedHash) {
            this.towTrucksInStreamingRange.push(entity.id);
            this.reattachTowedVehicles();

            alt.log("towTrucksInStreamingRange changed");
        }
    }

    onEntityStreamOut(entity: alt.Entity) {
        if (entity instanceof alt.Vehicle && entity.model == this.flatbedHash) {
            this.towTrucksInStreamingRange = this.towTrucksInStreamingRange.filter(vehid => vehid != entity.id);

            if (entity.hasStreamSyncedMeta("TowedVehicle")) {
                const towedVehicleId = entity.getStreamSyncedMeta("TowedVehicle");
                if (towedVehicleId == null) return;

                const attachedVehicle = alt.Vehicle.getByID(towedVehicleId);
                if (attachedVehicle != null && attachedVehicle.scriptID != null) this.deatchFromFlatBed(attachedVehicle.id, entity.id);
            }
        }
    }

    attachToFlatbed(vehicleId: number, flatbedId: number) {
        const vehicle = alt.Vehicle.getByID(vehicleId);
        const flatbed = alt.Vehicle.getByID(flatbedId);
        if(!vehicle || !flatbed) return alt.log("vehicleId || flatbedId == null");

        const boneIndex1 = game.getEntityBoneIndexByName(vehicle.scriptID, 'chassis');
        const boneIndex2 = game.getEntityBoneIndexByName(flatbed.scriptID, 'chassis');
        const [na, min, max] = game.getModelDimensions(vehicle.model, new alt.Vector3(0, 0, 0), new alt.Vector3(0, 0, 0));

        game.attachEntityToEntityPhysically(vehicle.scriptID, flatbed.scriptID, boneIndex1, boneIndex2, 0, -2.5, max.z, 0, 0, 0, 0, 0, 0, 0, true, true, false, false, 2);
    }

    deatchFromFlatBed(towedVehicleID: number, towTruckID: number) {
        const towedVehicle = alt.Vehicle.getByID(towedVehicleID);
        const towTruck = alt.Vehicle.getByID(towTruckID);
        if (!towedVehicle || !towTruck) return;

        game.detachEntity(towedVehicle.scriptID, true, true);

        const offset = game.getOffsetFromEntityInWorldCoords(towTruck.scriptID, 0, -10, 0);
        game.setEntityCoords(towedVehicle.scriptID, offset.x, offset.y, offset.z, true, false, false, true);
        game.setVehicleOnGroundProperly(towedVehicle.scriptID, 5);
    }
}

export default new Flatbed();