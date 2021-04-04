import alt from 'alt-client';
import Webview from './Webview';

let Views: View[] = [];

class View {
    name: string;

    constructor(name: string) {
        this.name = name;

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

    public static get all() {
        return Views;
    }

    public static getByName(name: string) {
        return this.all.find(x => x.name == name);
    }
}

export default View;