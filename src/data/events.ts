export const ClientEvents = {
    "Charcreator": {
        "Apply": "ApplyPlayerCharacter"
    },
    "WebView": {
        "showWindow": "Webview::ShowWindow",
        "closeWindow": "Webview::CloseWindow"
    },
    "Chat": {
        "Receive": "Chat::Receive"
    },
    "Voice": {
        "Range": "UpdateVoiceRange"
    }
}

export const ServerEvents = {
    "Charcreator": {
        "Save": "SavePlayerCharacter",
        "SetModel": "setModel"
    },
    "Clothing": {
        "SetClothes": "SetClothes",
        "SetProp": "SetProp"
    },
    "Chat": {
        "Message": "chat:message"
    },
    "Login": {
        "Auth": "RequestLoginResponse"
    },
    "Progressbar": {
        "Start": "Progress::Start"
    },
    "Ready": "PlayerReady"
}

export default {
    client: ClientEvents,
    server: ServerEvents
}