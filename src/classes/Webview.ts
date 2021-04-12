import alt from 'alt-client';
import EventHandler from '../handlers/EventHandler';

const devMode = true;

class Webview {
    webView: alt.WebView;

    constructor() {
        this.webView = new alt.WebView(devMode ? "http://localhost:8080/" : "http://assets/paradox-web/index.html");
        this.webView.on("load", () => this.onLoad());

        EventHandler.onServer("Webview::ShowWindow", this.showWindow.bind(this));
        EventHandler.onServer("Webview::CloseWindow", this.closeWindow.bind(this));
    }

    onLoad() {
        this.webView.unfocus();
        alt.log("WebView -> Loaded");
    }

    showWindow(name: string, ...args: any[]) {
        this.webView.emit("showWindow", name, ...args);

        alt.showCursor(true);
        alt.toggleGameControls(false);
    }

    closeWindow(name: string) {
        this.webView.emit("closeWindow", name);

        alt.showCursor(false);
        alt.toggleGameControls(true);
    }
}

export default new Webview();