import alt from 'alt-client';
class UIHandler {
	webView: alt.WebView;

    constructor() {
        this.webView = new alt.WebView('../ui/index.html');
		alt.log('Loaded.');
		alt.onServer('openWindow', (name, args: any[]) => {
			alt.log(`openWindow ${JSON.stringify(name)} ${JSON.stringify(args)}`);

			this.show(name, args);
		});
    }
	
	show(name: string, args: any[]) {
		alt.log(`show ${JSON.stringify(name)} ${JSON.stringify(args)}`);
        if (args && args.length > 0) {
            this.webView.emit("execute", "Windows", `show("${name}", '${args}')`);
        } else {
            this.webView.emit("execute", "Windows", `show("${name}")`);
        }
    }
}


export default new UIHandler();