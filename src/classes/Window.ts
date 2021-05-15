import alt from 'alt-client';
import WindowController from '../controllers/WindowController';
import WebView from './WebView';

export default class Window {
    name: string;
    visible: boolean;

    constructor(name: string) {
        this.name = name;
        this.visible = false;

        this.on("Open", () => {
            this.visible = true;
            this.onOpen();
        });

        this.on("Close", () => {
            this.visible = false;
            this.onClose();
        });

        alt.everyTick(() => {
            this.onTick();
        });

        alt.on("keydown", key => {
            this.onKey(key, true, this.visible);
        });

        alt.on("keyup", key => {
            this.onKey(key, false, this.visible);
        });

        alt.on("consoleCommand", (command: string, ...args: string[]) => {
            if(this.visible) this.onConsoleCommand(command, ...args);
        });

        WindowController.addWindow(this);
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        WebView.webView.on(`${this.name}::${eventName}`, (...args) => listener(...args));
    }

    off(eventName: string, listener: (...args: any[]) => void) {
        WebView.webView.off(`${this.name}::${eventName}`, (...args) => listener(...args));
    }

    emit(eventName: string, ...args: any[]) {
        WebView.webView.emit(`${this.name}::${eventName}`, ...args);
    }

    onOpen() {}
    onClose() {}
    onTick() {}
    onConsoleCommand(command: string, ...args: string[]) {}
    onKey(key: number, down: boolean, isOpen: boolean) {}
}