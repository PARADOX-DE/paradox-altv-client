import alt from 'alt-client';
import Controller from '../classes/Controller';
import Window from '../classes/Window';

let windows: Window[] = [];

class WindowController extends Controller {
    constructor() {
        super("Window");
    }

    addWindow(window: Window) {
        this.windows.push(window);
    }

    get windows() {
        return windows;
    }
}

export default new WindowController();