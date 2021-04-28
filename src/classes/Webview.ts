import alt from 'alt-client';
import EventHandler from '../handlers/EventHandler';

class Webview {
    webView: alt.WebView;

    constructor() {
        this.webView = new alt.WebView("http://localhost:8080/");
        this.webView.on("load", this.onLoad.bind(this));

        EventHandler.onServer("Webview::ShowWindow", this.showWindow.bind(this));
        EventHandler.onServer("Webview::CloseWindow", this.closeWindow.bind(this));
    }

    onLoad() {
        this.webView.unfocus();

        alt.log("[PX-RP] Das Interface wurde erfolgreich geladen.");
        EventHandler.emitServer("PlayerReady");
    }

    showWindow(name: string, args: object) {
        this.webView.emit("showWindow", name, args);
        alt.log(name + " " + JSON.stringify(args));
        alt.showCursor(true);
        alt.toggleGameControls(false);
    }

    closeWindow(name: string) {
        this.webView.emit("closeWindow", name);

        alt.showCursor(false);
        alt.toggleGameControls(true);
    }

    popWindow() {
        this.webView.emit("popWindow");

        alt.showCursor(false);
        alt.toggleGameControls(true);

        return true;
    }
}

export default new Webview();