import Window from '../../../classes/Window';

import EventController from '../../../controllers/EventController';

export class TeamLeaderAppView  extends Window {
    constructor() {
        super("TeamLeaderApp");

        this.on("InviteTeamMember", this.inviteTeamMember.bind(this));
    }

    inviteTeamMember(inviteString: string) {
        EventController.emitServer("InviteTeamMember", inviteString);
    }
}

export default new TeamLeaderAppView ();