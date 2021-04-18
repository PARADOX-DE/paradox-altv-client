import alt from 'alt-client';

export default class Handler {
    name: string;

    constructor(name: string) {
        this.name = name;

        alt.log(`[HANDLER] >> Loading ${this.name}..`);
    }
}