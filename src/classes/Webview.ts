import alt from 'alt-client';

const devMode = true;

class Webview {
    webView: alt.WebView;

    constructor() {
        this.webView = new alt.WebView(devMode ? "http://localhost:8080/" : "http://assets/paradox-web/index.html");
        this.webView.on("load", () => this.onLoad());
    }

    onLoad() {
        alt.log("WebView -> Loaded");
    }

    showWindow(name: string, ...args: any[]) {
        this.webView.emit("showWindow", name, ...args);
    }

    closeWindow(name: string) {
        this.webView.emit("closeWindow", name);
    }
}

export default new Webview();