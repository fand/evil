class @SidebarView
    constructor: (@model) ->
        @wrapper = $('#sidebar-wrapper')
        @tracks  = @wrapper.find('#sidebar-tracks')
        @master  = @wrapper.find('#sidebar-master')

        @master_name  = @master.find('[name=name]')
        @master_bpm   = @master.find('[name=bpm]')
        @master_key   = @master.find('[name=key]')
        @master_scale = @master.find('[name=mode]')
        @master_save  = @master.find('[name=save]')

        @initEvent()

    initEvent: ->
        @master_name.on('focus', ( => window.keyboard.beginInput())
        ).on('blur', ( => window.keyboard.endInput())
        ).on('change', ( => @saveMaster()))
        for m in [@master_bpm, @master_key, @master_scale]
            m.on('focus', ( => window.keyboard.beginInput())).on('blur', ( => window.keyboard.endInput()))
        @master_save.on('click', ( => @saveMaster()))


    saveMaster: ->
        name  = @master_name.val()
        bpm   = @master_bpm.val()
        key   = @master_key.val()
        scale = @master_scale.val()
        obj =
            name:  name if name?
            bpm:   bpm if bpm?
            key:   key if key?
            scale: scale if scale?
        @model.saveMaster(obj)

    clearMaster: ->
        o = name: @master_name.val()
        @model.saveMaster(o)
        @showMaster(o)

    showTracks: (o) ->
        # @master_name.val(o.name)   if o.name?
        # @master_bpm.val(o.bpm)     if o.bpm?
        # @master_key.val(o.key)     if o.key?
        # @master_scale.val(o.scale) if o.scale?
        @wrapper.css('left', '0px')


    showMaster: (o) ->
        @master_name.val(o.name)   if o.name?
        @master_bpm.val(o.bpm)     if o.bpm?
        @master_key.val(o.key)     if o.key?
        @master_scale.val(o.scale) if o.scale?
        @wrapper.css('left', '-141px')
