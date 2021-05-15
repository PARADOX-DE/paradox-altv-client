import alt from 'alt-client';
import { ClientEvents, ServerEvents } from '../data/events';

class WebView {
    public webView: alt.WebView;

    constructor() {
        this.webView = new alt.WebView("http://localhost:8080/");
        this.webView.on("load", () => {
            this.webView.focus();
            alt.emitServer(ServerEvents.Ready);
        });

        alt.onServer(ClientEvents.WebView.showWindow, this.showWindow.bind(this));
        alt.onServer(ClientEvents.WebView.closeWindow, this.closeWindow.bind(this));
    }

    showWindow(name: string, args: {}) {
        this.webView.emit("showWindow", name, args);
    }

    closeWindow(name: string) {
        this.webView.emit("closeWindow", name);
    }

    popWindow() {
        this.webView.emit("popWindow");
    }
}

export default new WebView();