/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import SidebarView from './SidebarView';

class Sidebar {
    constructor(ctx, player, session, mixer){
        this.addMasterEffect = this.addMasterEffect.bind(this);
        this.addTracksEffect = this.addTracksEffect.bind(this);
        this.ctx = ctx;
        this.player = player;
        this.session = session;
        this.mixer = mixer;
        this.sidebar_pos = {x:0, y:1, type: 'master'};
        this.view = new SidebarView(this);
    }

    show(song, select_pos) {
        this.song = song;
        this.select_pos = select_pos;
        if (this.select_pos.type === 'tracks') {
            if ((this.sidebar_pos.x === this.select_pos.x) && (this.sidebar_pos.type === this.select_pos.type)) { return; }
            this.saveTracksEffect(this.sidebar_pos.x);
            this.sidebar_pos = this.select_pos;
            return this.view.showTracks(this.player.synth[this.select_pos.x]);
        } else {
            if ((this.sidebar_pos.y === this.select_pos.y) && (this.sidebar_pos.type === this.select_pos.type)) { return; }
            this.sidebar_pos = this.select_pos;
            return this.view.showMaster(this.song.master[this.select_pos.y]);
        }
    }

    saveMaster(obj) {
        if (this.sidebar_pos.y === -1) { return; }
        return this.session.saveMaster(this.sidebar_pos.y, obj);
    }

    saveTracksEffect() {
        if (this.sidebar_pos.type === 'master') { return; }  // TODO: make sure this is impossible / delete this line
        //obj = @view.saveTracksEffect()
        //@session.saveTracksEffect(@sidebar_pos, obj)
        return this.session.saveTracksEffect(this.sidebar_pos);
    }

    addMasterEffect(name) {
        return this.mixer.addMasterEffect(name);
    }

    addTracksEffect(name) {
        return this.mixer.addTracksEffect(this.sidebar_pos.x, name);
    }

    setBPM(b) { return this.view.setBPM(b); }
    setKey(k) { return this.view.setKey(k); }
    setScale(s) { return this.view.setScale(s); }
}


// Export!
export default Sidebar;
