import alt from 'alt-client';
import game from 'natives';

import EventHandler from '../../../handlers/EventHandler';
import View from '../../../classes/View';

class TeamLeaderAppView extends View {
    constructor() {
        super("TeamLeaderApp");

        this.on("InviteTeamMember", this.inviteTeamMember.bind(this));
    }

    inviteTeamMember(inviteString: string) {
        EventHandler.emitServer("InviteTeamMember", inviteString);
    }
}

export default new TeamLeaderAppView();