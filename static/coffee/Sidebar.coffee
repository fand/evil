class @Sidebar
    constructor: (@ctx, @player, @session, @mixer)->
        @sidebar_pos = x:0, y:1, type: 'master'
        @view = new SidebarView(this)

    show: (@song, @select_pos) ->
        if @select_pos.type == 'tracks'
            return if @sidebar_pos.x == @select_pos.x and @sidebar_pos.type == @select_pos.type
            @saveTracksEffect(@sidebar_pos.x)
            @sidebar_pos = @select_pos
            @view.showTracks(@player.synth[@select_pos.x])
        else
            return if @sidebar_pos.y == @select_pos.y and @sidebar_pos.type == @select_pos.type
            @sidebar_pos = @select_pos
            @view.showMaster(@song.master[@select_pos.y])

    saveMaster: (obj) ->
        return if @sidebar_pos.y == -1
        @session.saveMaster(@sidebar_pos.y, obj)

    saveTracksEffect: ->
        return if @sidebar_pos.type == 'master'  # TODO: make sure this is impossible / delete this line
        #obj = @view.saveTracksEffect()
        #@session.saveTracksEffect(@sidebar_pos, obj)
        @session.saveTracksEffect(@sidebar_pos)

    addMasterEffect: (name) =>
        @mixer.addMasterEffect(name)

    addTracksEffect: (name) =>
        @mixer.addTracksEffect(@sidebar_pos.x, name)
