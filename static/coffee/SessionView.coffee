class @SessionView
    constructor: (@model, @song) ->
        @wrapper_mixer = $('#mixer-tracks')
        @wrapper_master = $('#session-master-wrapper')
        @wrapper_tracks = $('#session-tracks-wrapper')
        @wrapper_tracks_sub = $('#session-tracks-wrapper-sub')

        @canvas_tracks_dom = $('#session-tracks')
        @canvas_master_dom = $('#session-master')
        @canvas_tracks_on_dom = $('#session-tracks-on')
        @canvas_master_on_dom = $('#session-master-on')
        @canvas_tracks_hover_dom = $('#session-tracks-hover')
        @canvas_master_hover_dom = $('#session-master-hover')

        @canvas_tracks = @canvas_tracks_dom[0]
        @canvas_master = @canvas_master_dom[0]
        @canvas_tracks_on = @canvas_tracks_on_dom[0]
        @canvas_master_on = @canvas_master_on_dom[0]
        @canvas_tracks_hover = @canvas_tracks_hover_dom[0]
        @canvas_master_hover = @canvas_master_hover_dom[0]

        @ctx_tracks = @canvas_tracks.getContext('2d')
        @ctx_master = @canvas_master.getContext('2d')
        @ctx_tracks_on = @canvas_tracks_on.getContext('2d')
        @ctx_master_on = @canvas_master_on.getContext('2d')
        @ctx_tracks_hover = @canvas_tracks_hover.getContext('2d')
        @ctx_master_hover = @canvas_master_hover.getContext('2d')

        @w = 80
        @h = 20
        @color = ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']

        @color_schemes =
            REZ: ['rgba(200, 200, 200, 1.0)', 'rgba(  0, 220, 250, 0.7)', 'rgba(100, 230, 255, 0.7)',
                  'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']
            SAMPLER: ['rgba(230, 230, 230, 1.0)', 'rgba(  255, 100, 192, 0.7)', 'rgba(255, 160, 216, 0.7)',
                      'rgba(200, 200, 200, 1.0)', 'rgba(255, 255, 255, 1.0)']

        @track_color = (@color for i in [0...8])

        @img_play = new Image()
        @img_play.src = 'static/img/play.png'
        @img_play.onload = () => @initCanvas()

        @last_active = []
        @current_cells = []

        @hover_pos = x:-1, y:-1
        @click_pos = x:-1, y:-1
        @last_clicked = performance.now()

        @dialog = $('#dialog')
        @dialog_wrapper = $('#dialog-wrapper')
        @dialog_close = @dialog.find('.dialog-close')
        @btn_save = $('#btn-save')
        @btn_clear = $('#btn-clear')
        @song_info = $('#song-info')
        @song_title = @song_info.find('#song-title')
        @song_creator = @song_info.find('#song-creator')

        @social_twitter  = $('#twitter')
        @social_facebook = $('#facebook')
        @social_hatena   = $('#hatena')


    initCanvas: ->
        @canvas_tracks.width  = @canvas_tracks_on.width  = @canvas_tracks_hover.width  = @w*8 + 1
        @canvas_master.width  = @canvas_master_on.width  = @canvas_master_hover.width  = @w + 1
        @canvas_tracks.height = @canvas_tracks_on.height = @canvas_tracks_hover.height = @h*15 + 10
        @canvas_master.height = @canvas_master_on.height = @canvas_master_hover.height = @h*15 + 10

        @offset_y = 20
        @ctx_tracks.translate(0, @offset_y)
        @ctx_master.translate(0, @offset_y)
        @ctx_tracks_on.translate(0, @offset_y)
        @ctx_master_on.translate(0, @offset_y)
        @ctx_tracks_hover.translate(0, @offset_y)
        @ctx_master_hover.translate(0, @offset_y)

        @font_size = 12
        @ctx_tracks.font = @ctx_master.font = @font_size + 'px "ＭＳ Ｐゴシック, ヒラギノ角ゴ Pro W3"';
        @rect_tracks = @canvas_tracks_hover.getBoundingClientRect()
        @rect_master = @canvas_master_hover.getBoundingClientRect()
        @offset_translate = 700 + @offset_y

        @initEvent()

    resize: () ->
        @ctx_tracks.translate(0, -@offset_y)
        @ctx_master.translate(0, -@offset_y)
        @ctx_tracks_on.translate(0, -@offset_y)
        @ctx_master_on.translate(0, -@offset_y)
        @ctx_tracks_hover.translate(0, -@offset_y)
        @ctx_master_hover.translate(0, -@offset_y)

        w_new = Math.max(@song.tracks.length, 8) * @w + 1
        h_new = Math.max(@song.length + 1, 15) * @h + 10    # 0th cell is for track name!

        @canvas_tracks.width  = @canvas_tracks_on.width  = @canvas_tracks_hover.width  = w_new
        @canvas_tracks.height = @canvas_tracks_on.height = @canvas_tracks_hover.height = h_new
        @canvas_master.height = @canvas_master_on.height = @canvas_master_hover.height = h_new
        @canvas_tracks_dom.css(width: w_new + 'px', height: h_new + 'px')
        @canvas_tracks_on_dom.css(width: w_new + 'px', height: h_new + 'px')
        @canvas_tracks_hover_dom.css(width: w_new + 'px', height: h_new + 'px')
        @canvas_master_dom.css(height: h_new + 'px')
        @canvas_master_on_dom.css(height: h_new + 'px')
        @canvas_master_hover_dom.css(height: h_new + 'px')

        @wrapper_tracks.css(width: w_new + 'px')
        @wrapper_tracks_sub.css(width: w_new + 'px')

        @ctx_tracks.translate(0, @offset_y)
        @ctx_master.translate(0, @offset_y)
        @ctx_tracks_on.translate(0, @offset_y)
        @ctx_master_on.translate(0, @offset_y)
        @ctx_tracks_hover.translate(0, @offset_y)
        @ctx_master_hover.translate(0, @offset_y)

    getPos: (rect, wrapper, e) ->
        _x = Math.floor((e.clientX - rect.left + @wrapper_mixer.scrollLeft()) / @w)
        _y = Math.floor((e.clientY - rect.top  + wrapper.scrollTop() - @offset_translate) / @h)
        x: _x
        y: _y

    getPlayPos: (rect, wrapper, e) ->
        _x = Math.floor((e.clientX - rect.left + @wrapper_mixer.scrollLeft()) / @w)
        _y = Math.floor((e.clientY - rect.top  + wrapper.scrollTop() - @offset_translate) / @h)

        # inside canvas && not track name space
        if not ((e.clientX - rect.left + @wrapper_mixer.scrollLeft()) - _x * @w < 20 and (e.clientY - rect.top + wrapper.scrollTop() - @offset_translate) - _y * @h < 20)
            _y = -1

        x: _x
        y: _y

    initEvent: ->
        # Tracks canvas
        @canvas_tracks_hover_dom.on('mousemove', (e) =>
            pos = @getPos(@rect_tracks, @wrapper_tracks_sub, e)
            @drawHover(@ctx_tracks_hover, pos)
        ).on('mouseout', (e) =>
            @clearHover(@ctx_tracks_hover)
            @hover_pos = x:-1, y:-1
        ).on('mousedown', (e) =>
            pos = @getPlayPos(@rect_tracks, @wrapper_tracks_sub, e)
            if pos.y >= 0
                @cueTracks(pos.x, pos.y)
            else
                pos = @getPos(@rect_tracks, @wrapper_tracks_sub, e)
                now = performance.now()  # more accurate than Date.now()

                # Double clicked
                if now - @last_clicked < 500 and pos.y != -1
                    @editPattern(pos)
                    @last_clicked = -10000  # prevent triple-click

                # Clicked
                else
                    @last_clicked = now
        )

        # Master canvas
        @canvas_master_hover_dom.on('mousemove', (e) =>
            pos = @getPos(@rect_master, @wrapper_master, e)
            @drawHover(@ctx_master_hover, pos)
        ).on('mouseout', (e) =>
            @clearHover(@ctx_master_hover)
        ).on('mousedown', (e) =>
            pos = @getPlayPos(@rect_master, @wrapper_master, e)
            if pos.y >= 0
                @cueMaster(pos.x, pos.y)
        )

        @wrapper_master.on('scroll', (e) => @wrapper_tracks_sub.scrollTop(@wrapper_master.scrollTop()))
        @wrapper_tracks_sub.on('scroll', (e) => @wrapper_master.scrollTop(@wrapper_tracks_sub.scrollTop()))

        # for Other view
        @btn_save.on('click', () => @model.saveSong())
        @dialog.on('mousedown', (e) =>
            if (not @dialog_wrapper.is(e.target)) and @dialog_wrapper.has(e.target).length == 0
                @closeDialog()
        )
        @dialog_close.on('mousedown', () => @closeDialog())

        @song_title.on('focus', () => window.is_input_mode = true).on('change', () => @model.setSongTitle(@song_title.val())).on('blur', () => window.is_input_mode = false)
        @song_creator.on('focus', () => window.is_input_mode = true).on('change', () => @model.setCreatorName(@song_creator.val())).on('blur', () => window.is_input_mode = false)

        @social_twitter.on('click',  () => @share('twitter'))
        @social_facebook.on('click', () => @share('facebook'))
        @social_hatena.on('click',   () => @share('hatena'))

        @readSong(@song, @current_cells)


    readSong: (@song, @current_cells) ->
        @resize()

        # Draw tracks
        for x in [0...Math.max(song.tracks.length + 1, 8)]
            t = song.tracks[x]
            if t?
                if t.type?
                    @track_color[x] = @color_schemes[t.type]

                @track_color[x] = @color_schemes[t.type] if t.type?

                @drawTrackName(x, t.name) if t.name?

            for y in [0...Math.max(song.length, 10)]
                if t? and t.patterns[y]?
                    @drawCell(@ctx_tracks, t.patterns[y], x, y)
                else
                    @drawEmpty(@ctx_tracks, x, y)

        # Draw master
        for y in [0...Math.max(song.length, 10)]
            if song.master[y]?
                @drawCell(@ctx_master, song.master[y], 0, y)
            else
                @drawEmptyMaster(y)

        @drawScene(0, @current_cells)

        # set Global info
        @song_title.val(@song.title)
        @song_creator.val(@song.creator)


    drawCell: (ctx, p, x, y) ->
        @clearCell(ctx, x, y)

        if not @track_color[x]?
            @track_color[x] = @color_schemes[@song.tracks[x].type]

        ctx.strokeStyle = @track_color[x][1]
        ctx.lineWidth = 2
        ctx.strokeRect(x * @w + 2, y * @h + 2, @w-2, @h-2)
        ctx.drawImage(@img_play, 0, 0, 18, 18,  x*@w + 3, y*@h + 3, 16, 15)

        ctx.fillStyle = @track_color[x][1]
        ctx.fillText(p.name, x * @w + 24, (y + 1) * @h - 6)

    drawEmpty: (ctx, x, y) ->
        @clearCell(ctx, x, y)
        ctx.strokeStyle = @color[0]
        ctx.lineWidth = 1
        ctx.strokeRect(x * @w + 2, y * @h + 2, @w-2, @h-2)

    drawEmptyMaster: (y) ->
        @clearCell(@ctx_master, 0, y)
        @ctx_master.strokeStyle = @color[0]
        @ctx_master.lineWidth = 1
        @ctx_master.strokeRect(2, y * @h + 2, @w-2, @h-2)
        @ctx_master.drawImage(@img_play, 0, 0, 18, 18, 3, y*@h + 3, 16, 15)

    clearCell: (ctx, x, y) ->
        ctx.clearRect(x * @w, y * @h, @w, @h)

    drawTrackName: (x, name, type) ->
        if type?
            @track_color[x] = @color_schemes[type]

        @ctx_tracks.fillStyle = @track_color[x][1]
        @ctx_tracks.fillRect(x * @w + 2, -20, @w - 2, 18)

        m = @ctx_tracks.measureText(name)
        dx = (@w - m.width)  / 2
        dy = (@offset_y - @font_size) / 2

        @ctx_tracks.shadowColor = '#fff'
        @ctx_tracks.shadowBlur  = 1
        @ctx_tracks.fillStyle   = '#fff'
        @ctx_tracks.fillText(name, x * @w + dx + 2, -dy-3)
        @ctx_tracks.shadowBlur  = 0

    drawPatternName: (x, y, p) ->
        @drawCell(@ctx_tracks, p, x, y)

    drawSceneName: (y, name) ->

    drawScene: (pos, cells) ->
        @ctx_tracks_on.clearRect(0, @scene_pos * @h, @w * 8, @h)
        @ctx_master_on.clearRect(0, @scene_pos * @h, @w, @h)

        if cells?
            @current_cells = cells

        for i in [0...@current_cells.length]
            @drawActive(i, @current_cells[i])

        @drawActiveMaster(pos)
        @scene_pos = pos

    drawActive: (x, y) ->
        @clearActive(x)

        # outside cell
        @ctx_tracks_on.strokeStyle = 'rgba(0, 230, 255, 0.3)'
        @ctx_tracks_on.lineWidth = 2
        @ctx_tracks_on.strokeRect(x*@w + 4, y*@h + 4, @w-6, @h-6)

        # inside cell
        @ctx_tracks_on.drawImage(@img_play, 36, 0, 18, 18,  x*@w + 3, y*@h + 3, 16, 15)
        @last_active[x] = y

    drawActiveMaster: (y) ->
        @ctx_master_on.clearRect(0, 0, @w, 10000)

        # outside cell
        @ctx_master_on.strokeStyle = 'rgba(0, 230, 255, 0.3)'
        @ctx_master_on.lineWidth = 2
        @ctx_master_on.strokeRect(4, y*@h + 4, @w-6, @h-6)

        # inside cell
        @ctx_master_on.drawImage(@img_play, 36, 0, 18, 18,  3, y*@h + 3, 16, 15)

    drawHover: (ctx, pos) ->
        @clearHover(ctx)
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ctx.fillRect(pos.x * @w, pos.y * @h, @w, @h)
        if ctx == @ctx_tracks_hover
            @hover_pos = pos

    clearHover: (ctx) ->
        if ctx == @ctx_tracks_hover
            ctx.clearRect(@hover_pos.x * @w, -100, @w, 10000)
            ctx.clearRect(0, @hover_pos.y * @h, 10000, @h)
        else
            ctx.clearRect(0, 0, @w, 1000)

    clearActive: (x) ->
        @ctx_tracks_on.clearRect(x*@w, @last_active[x]*@h, @w, @h)

    clearAllActive: () ->
        @ctx_tracks_on.clearRect(0, 0, 10000, 10000)
        @ctx_master_on.clearRect(0, 0, 10000, 10000)

    cueTracks: (x, y) ->
        if @song.tracks[x]? and @song.tracks[x].patterns[y]?
            @model.cuePattern(x, y)
            @ctx_tracks_on.drawImage(@img_play, 36, 0, 18, 18, x*@w + 4, y*@h + 4, 15, 16)
            window.setTimeout(( => @ctx_tracks_on.clearRect(x*@w+4, y*@h+4, 15, 16)), 100)

    cueMaster: (x, y) ->
        if @song.master[y]?
            @model.cueScene(y)
            @ctx_master_on.drawImage(@img_play, 36, 0, 18, 18,  4, y*@h + 4, 15, 16)
            window.setTimeout(( => @ctx_master_on.clearRect(4, y*@h + 4, 15, 16)), 100)

    beat: (is_master, cells) ->
        if is_master
            c = cells
            @ctx_master_on.drawImage(@img_play, 36, 0, 18, 18, c[0]*@w + 3, c[1]*@h + 3, 16, 15)
            window.setTimeout(( => @ctx_master_on.clearRect(c[0]*@w+3, c[1]*@h+3, 16, 15)), 100)
        else
            for c in cells
                @ctx_tracks_on.drawImage(@img_play, 36, 0, 18, 18, c[0]*@w + 3, c[1]*@h + 3, 16, 15)
                window.setTimeout(( => @ctx_tracks_on.clearRect(c[0]*@w+3, c[1]*@h+3, 16, 15)), 100)


    editPattern: (pos) ->
        pat = @model.editPattern(pos.x, pos.y)
        @drawCell(@ctx_tracks, pat[2], pat[0], pat[1])

    addSynth: (@song) ->
        @readSong(@song, @current_cells)


    showSuccess: (_url, song_title, user_name) ->

        if song_title?
            if user_name?
                text = '"' + song_title + '" by ' + user_name
            else
                text = '"' + song_title + '"'
            title = text + ' :: evil'
        else
            text = '"evil" by gmork'
            title = 'evil'
        url = 'http://evil.gmork.in/' + _url

        history.pushState('', title, _url)
        document.title = title

        @dialog.css(opacity: '1', 'z-index': '10000')
        @dialog.find('#dialog-socials').show()
        @dialog.find('#dialog-success').show()
        @dialog.find('#dialog-error').hide()
        @dialog.find('.dialog-message-sub').text(url)
        tw_url = 'http://twitter.com/intent/tweet?url=' + encodeURI(url + '&text=' + text + '&hashtags=evil')
        fb_url = 'http://www.facebook.com/sharer.php?&u=' + url
        @dialog.find('.dialog-twitter').attr('href', tw_url).click( => @closeDialog())
        @dialog.find('.dialog-facebook').attr('href', fb_url).click( => @closeDialog())

    showError: (error) ->
        @dialog.css(opacity: '1', 'z-index': '10000')
        @dialog.find('#dialog-socials').hide()
        @dialog.find('#dialog-success').hide()
        @dialog.find('#dialog-error').show()

    closeDialog: ->
        @dialog.css(opacity: '1', 'z-index': '-10000')

    share: (service) ->

        if @song.title?
            if @song.creator?
                text = '"' + @song.title + '" by ' + @song.creator
            else
                text = '"' + @song.title + '"'
            title = text + ' :: evil'
        else
            text = '"evil" by gmork'
            title = 'evil'

        url = location.href

        if service == 'twitter'
            tw_url = 'http://twitter.com/intent/tweet?url=' + encodeURI(url + '&text=' + text + '&hashtags=evil')
            window.open(tw_url, 'Tweet', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1')
        else if service == 'facebook'
            fb_url = 'http://www.facebook.com/sharer.php?&u=' + url
            window.open(fb_url, 'Share on facebook', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1')
        else
            hb_url = 'http://b.hatena.ne.jp/entry/' + url.split('://')[1]
            window.open(hb_url)


    changeSynth: (id, type) ->
        #@readSong(@song, @current_cells)
