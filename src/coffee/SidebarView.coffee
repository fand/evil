$ = require 'jquery'

class SidebarView
    constructor: (@model) ->
        @wrapper = $('#sidebar-wrapper')
        @tracks  = @wrapper.find('#sidebar-tracks')
        @master  = @wrapper.find('#sidebar-master')

        @master_display  = @master.find('.display')
        @master_control  = @master.find('.control')

        @master_display_label  = @master.find('.display-current-control')
        @master_edit  = @master.find('[name=edit]')

        @master_name  = @master.find('[name=name]')
        @master_bpm   = @master.find('[name=bpm]')
        @master_key   = @master.find('[name=key]')
        @master_scale = @master.find('[name=mode]')
        @master_save  = @master.find('[name=save]')

        @master_effects = @master.find('.sidebar-effects')
        @add_master     = @master.find('.add-type')
        @add_master_btn = @master.find('.add-btn')
        @tracks_effects = @tracks.find('.sidebar-effects')
        @add_tracks     = @tracks.find('.add-type')
        @add_tracks_btn = @tracks.find('.add-btn')

        @initEvent()

        # init Master Effect


    initEvent: ->
        @master_name.on('focus', ( => window.keyboard.beginInput())
        ).on('blur', ( => window.keyboard.endInput())
        ).on('change', ( => @saveMaster()))
        for m in [@master_bpm, @master_key, @master_scale]
            m.on('focus', ( => window.keyboard.beginInput())).on('blur', ( => window.keyboard.endInput()))
        @master_save.on('click', ( => @saveMaster(); @hideMasterControl()))
        @master_edit.on('click', ( => @showMasterControl()))

        @tracks.find('.sidebar-effect').each((i)=>
            $(this).on('change', =>
                # change i-th effect
                @model.readTracksEffect(i)
            )
        )

        @add_master_btn.on('click', () =>
            @addMasterEffect(@add_master.val())
        )

        @add_tracks_btn.on('click', () =>
            @addTracksEffect(@add_tracks.val())
        )

    saveMaster: ->
        name  = @master_name.val()
        bpm   = @master_bpm.val()
        key   = @master_key.val()
        scale = @master_scale.val()
        obj = {
            name:  name if name?
            bpm:   bpm if bpm?
            key:   key if key?
            scale: scale if scale?
        }
        @model.saveMaster(obj)
        @showMaster(obj)

    clearMaster: ->
        o = name: @master_name.val()
        @model.saveMaster(o)
        @showMaster(o)

    saveTracksEffect: ->
        (f.getParam() for f in @tracks_effects)

    showTracks: (track) ->
        @tracks_effects.find('.sidebar-effect').remove()
        f.appendTo(@tracks_effects) for f in track.effects
        @wrapper.css('left', '0px')

    showMaster: (o) ->
        @hideMasterControl()

        s = ''
        @master_name.val(o.name)   if o.name?
        s += o.bpm + ' BPM 　'   if o.bpm?
        s += o.key + ' 　'   if o.key?
        s += o.scale if o.scale?
        @master_display_label.text(s)

        @wrapper.css('left', '-223px')

    showMasterControl: ->
        @master_control.show()
        @master_display.hide()

    hideMasterControl: ->
        @master_display.show()
        @master_control.hide()

    addMasterEffect: (name) ->
        fx = @model.addMasterEffect(name)
        fx.appendTo(@master_effects)

    addTracksEffect: (name) ->
        fx = @model.addTracksEffect(name)
        fx.appendTo(@tracks_effects)

    setBPM:   (b) -> @master_bpm.val(b)
    setKey:   (k) -> @master_key.val(k)
    setScale: (s) -> @master_scale.val(s)


# Exports!
module.exports = SidebarView
