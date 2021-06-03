import alt from 'alt-client';
import EventController from '../controllers/EventController';

class WebView {
    public webView: alt.WebView;

    constructor() {
        this.webView = new alt.WebView("http://localhost:8080/");
        this.webView.on("load", () => {
            this.webView.focus();
            EventController.emitServer("PlayerReady");
        });

        EventController.onServer("Webview::ShowWindow", this.showWindow.bind(this));
        EventController.onServer("Webview::CloseWindow", this.closeWindow.bind(this));
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