import WebView from "./classes/Webview";
import KeyHandler from './handlers/KeyHandler';
import EventHandler from './handlers/EventHandler';

EventHandler.emitServer("test");
new KeyHandler("E", 69);