import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../handlers/EventHandler';
import controls from '../systems/controls';
import View from './View';

class Webview {
    webView: alt.WebView;

    constructor() {
        this.webView = new alt.WebView("http://localhost:8080");
        this.webView.on("load", this.onLoad.bind(this));

        EventHandler.onServer("Webview::ShowWindow", this.showWindow.bind(this));
        EventHandler.onServer("Webview::CloseWindow", this.closeWindow.bind(this));

        EventHandler.onServer("ViewCallback", (componentName: string, eventName: string, args: {}) => {
            this.webView.emit(`${componentName}::${eventName}`, args);
        });

        this.webView.on("showCursor", state => controls.showCursor(state));
        this.webView.on("toggleGameControls", state => controls.toggleGameControls(state));

        this.webView.on("triggerServerEvent", (eventName, ...args) => EventHandler.emitServer(eventName, ...args));
        this.webView.on("componentEvent", (eventName, ...args) => this.webView.emit(eventName, ...args));
        
    }

    onLoad() {
        this.webView.focus();

        alt.log(`[WEBVIEW] >> Main interface loaded...`);
        EventHandler.emitServer("PlayerReady");
    }

    showWindow(name: string, args: {}) {
        game.playSoundFrontend(-1, '5_SEC_WARNING', 'HUD_MINI_GAME_SOUNDSET', true);

        this.webView.emit("showWindow", name, args);
    }

    closeWindow(name: string) {
        this.webView.emit("closeWindow", name);
    }

    popWindow() {
        this.webView.emit("popWindow");

        controls.showCursor(false);
        controls.toggleGameControls(true);

        return true;
    }
    
    static get allViews() {
        return View.all;
    }

    isOpen(window: string, checkHud: boolean = false) {
        return checkHud ? Webview.allViews.some(x => x.name == window && x.open == true) : Webview.allViews.some(x => x.name == window && x.name != "Hud" && x.open == true);
    }
}

export default new Webview();