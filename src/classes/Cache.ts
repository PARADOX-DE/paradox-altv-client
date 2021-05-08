import alt from 'alt-client';
import EventHandler from '../handlers/EventHandler';

export default class Cache {
    name: string;
    _data: any;

    constructor(name: string, data: any = {}) {
        this.name = name;
        this._data = data;

        EventHandler.onServer(`Cache::${this.name}::Update`, (data) => this.data = data);
        this.log(`[CACHE][${this.name}] >> loaded...`);
    }

    private log(...args: any[]) {
        if(alt.isInDebug()) alt.log(...args);
    }

    set data(val: any) {
        this._data = val;
    }

    get data() {
        return this._data;
    }
}