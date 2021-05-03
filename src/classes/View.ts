import alt from 'alt-client';
import Webview from './Webview';

let Views: View[] = [];

class View {
    name: string;
    open: boolean;

    constructor(name: string) {
        this.name = name;
        this.open = false;

        this.on("Close", this.onClose.bind(this));
        this.on("Load", this.onOpen.bind(this));

        Views.push(this);
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        Webview.webView.on(`${this.name}::${eventName}`, (...args) => listener(...args));
    }

    off(eventName: string, listener: (...args: any[]) => void) {
        Webview.webView.off(`${this.name}::${eventName}`, (...args) => listener(...args));
    }

    emit(eventName: string, ...args: any[]) {
        Webview.webView.emit(`${this.name}::${eventName}`, ...args);
    }

    onClose() {
        this.open = false;
    }

    onOpen() {
        this.open = true;
    }

    public get alt() {
        return {
            on(eventName: string, listener: (...args: any[]) => void) {
                Webview.webView.on(eventName, (...args) => listener(...args));
            },
            off(eventName: string, listener: (...args: any[]) => void) {
                Webview.webView.off(eventName, (...args) => listener(...args));
            },
            emit(eventName: string, ...args: any[]) {
                Webview.webView.emit(eventName, ...args);
            }
        }
    }

    public get webview() {
        return Webview.webView;
    }

    public static get all() {
        return Views;
    }

    public static getByName(name: string) {
        return this.all.find(x => x.name == name);
    }
}

export default View;