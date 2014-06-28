(function(){this.SessionView=function(){function t(t,s){var e;this.model=t,this.song=s,this.wrapper_mixer=$("#mixer-tracks"),this.wrapper_master=$("#session-master-wrapper"),this.wrapper_tracks=$("#session-tracks-wrapper"),this.wrapper_tracks_sub=$("#session-tracks-wrapper-sub"),this.canvas_tracks_dom=$("#session-tracks"),this.canvas_master_dom=$("#session-master"),this.canvas_tracks_on_dom=$("#session-tracks-on"),this.canvas_master_on_dom=$("#session-master-on"),this.canvas_tracks_hover_dom=$("#session-tracks-hover"),this.canvas_master_hover_dom=$("#session-master-hover"),this.canvas_tracks=this.canvas_tracks_dom[0],this.canvas_master=this.canvas_master_dom[0],this.canvas_tracks_on=this.canvas_tracks_on_dom[0],this.canvas_master_on=this.canvas_master_on_dom[0],this.canvas_tracks_hover=this.canvas_tracks_hover_dom[0],this.canvas_master_hover=this.canvas_master_hover_dom[0],this.ctx_tracks=this.canvas_tracks.getContext("2d"),this.ctx_master=this.canvas_master.getContext("2d"),this.ctx_tracks_on=this.canvas_tracks_on.getContext("2d"),this.ctx_master_on=this.canvas_master_on.getContext("2d"),this.ctx_tracks_hover=this.canvas_tracks_hover.getContext("2d"),this.ctx_master_hover=this.canvas_master_hover.getContext("2d"),this.w=70,this.h=20,this.w_master=80,this.color=["rgba(200, 200, 200, 1.0)","rgba(  0, 220, 250, 0.7)","rgba(100, 230, 255, 0.7)","rgba(200, 200, 200, 1.0)","rgba(255, 255, 255, 1.0)","rgba(100, 230, 255, 0.2)"],this.color_schemes={REZ:["rgba(200, 200, 200, 1.0)","rgba(  0, 220, 250, 0.7)","rgba(100, 230, 255, 0.7)","rgba(200, 200, 200, 1.0)","rgba(255, 255, 255, 1.0)","rgba(100, 230, 255, 0.2)"],SAMPLER:["rgba(230, 230, 230, 1.0)","rgba(  255, 100, 192, 0.7)","rgba(255, 160, 216, 0.7)","rgba(200, 200, 200, 1.0)","rgba(255, 255, 255, 1.0)","rgba(255, 160, 216, 0.2)"]},this.track_color=function(){var t,s;for(s=[],e=t=0;8>t;e=++t)s.push(this.color);return s}.call(this),this.img_play=new Image,this.img_play.src="static/img/play.png",this.img_play.onload=function(t){return function(){return t.initCanvas()}}(this),this.last_active=[],this.current_cells=[],this.hover_pos={x:-1,y:-1},this.click_pos={x:-1,y:-1},this.select_pos={x:0,y:0,type:"master"},this.last_clicked=performance.now(),this.dialog=$("#dialog"),this.dialog_wrapper=$("#dialog-wrapper"),this.dialog_close=this.dialog.find(".dialog-close"),this.btn_save=$("#btn-save"),this.btn_clear=$("#btn-clear"),this.song_info=$("#song-info"),this.song_title=this.song_info.find("#song-title"),this.song_creator=this.song_info.find("#song-creator"),this.social_twitter=$("#twitter"),this.social_facebook=$("#facebook"),this.social_hatena=$("#hatena")}return t.prototype.initCanvas=function(){return this.canvas_tracks.width=this.canvas_tracks_on.width=this.canvas_tracks_hover.width=8*this.w+1,this.canvas_master.width=this.canvas_master_on.width=this.canvas_master_hover.width=this.w+11,this.canvas_tracks.height=this.canvas_tracks_on.height=this.canvas_tracks_hover.height=11*this.h+10,this.canvas_master.height=this.canvas_master_on.height=this.canvas_master_hover.height=11*this.h+10,this.offset_y=20,this.ctx_tracks.translate(0,this.offset_y),this.ctx_master.translate(0,this.offset_y),this.ctx_tracks_on.translate(0,this.offset_y),this.ctx_master_on.translate(0,this.offset_y),this.ctx_tracks_hover.translate(0,this.offset_y),this.ctx_master_hover.translate(0,this.offset_y),this.font_size=12,this.ctx_tracks.font=this.ctx_master.font=this.font_size+'px "ＭＳ Ｐゴシック, ヒラギノ角ゴ Pro W3"',this.rect_tracks=this.canvas_tracks_hover.getBoundingClientRect(),this.rect_master=this.canvas_master_hover.getBoundingClientRect(),this.offset_translate=700+this.offset_y,this.initEvent()},t.prototype.resize=function(){var t,s;return this.ctx_tracks.translate(0,-this.offset_y),this.ctx_master.translate(0,-this.offset_y),this.ctx_tracks_on.translate(0,-this.offset_y),this.ctx_master_on.translate(0,-this.offset_y),this.ctx_tracks_hover.translate(0,-this.offset_y),this.ctx_master_hover.translate(0,-this.offset_y),s=Math.max(this.song.tracks.length,8)*this.w+1,t=Math.max(this.song.length+2,11)*this.h+10,this.canvas_tracks.width=this.canvas_tracks_on.width=this.canvas_tracks_hover.width=s,this.canvas_tracks.height=this.canvas_tracks_on.height=this.canvas_tracks_hover.height=t,this.canvas_master.height=this.canvas_master_on.height=this.canvas_master_hover.height=t,this.canvas_tracks_dom.css({width:s+"px",height:t+"px"}),this.canvas_tracks_on_dom.css({width:s+"px",height:t+"px"}),this.canvas_tracks_hover_dom.css({width:s+"px",height:t+"px"}),this.canvas_master_dom.css({height:t+"px"}),this.canvas_master_on_dom.css({height:t+"px"}),this.canvas_master_hover_dom.css({height:t+"px"}),this.wrapper_tracks.css({width:s+"px"}),this.wrapper_tracks_sub.css({width:s+"px"}),this.ctx_tracks.translate(0,this.offset_y),this.ctx_master.translate(0,this.offset_y),this.ctx_tracks_on.translate(0,this.offset_y),this.ctx_master_on.translate(0,this.offset_y),this.ctx_tracks_hover.translate(0,this.offset_y),this.ctx_master_hover.translate(0,this.offset_y)},t.prototype.getPos=function(t,s,e,i){var r,h;return r=Math.floor((e.clientX-t.left+this.wrapper_mixer.scrollLeft())/this.w),h=Math.floor((e.clientY-t.top+s.scrollTop()-this.offset_translate)/this.h),{x:r,y:h,type:i}},t.prototype.getPlayPos=function(t,s,e){var i,r;return i=Math.floor((e.clientX-t.left+this.wrapper_mixer.scrollLeft())/this.w),r=Math.floor((e.clientY-t.top+s.scrollTop()-this.offset_translate)/this.h),e.clientX-t.left+this.wrapper_mixer.scrollLeft()-i*this.w<20&&e.clientY-t.top+s.scrollTop()-this.offset_translate-r*this.h<20||(r=-1),{x:i,y:r}},t.prototype.initEvent=function(){return this.canvas_tracks_hover_dom.on("mousemove",function(t){return function(s){var e;return e=t.getPos(t.rect_tracks,t.wrapper_tracks_sub,s,"tracks"),t.is_clicked?t.drawDrag(t.ctx_tracks_hover,e):t.drawHover(t.ctx_tracks_hover,e)}}(this)).on("mouseout",function(t){return function(){return t.clearHover(t.ctx_tracks_hover),t.hover_pos={x:-1,y:-1},t.is_clicked=!1}}(this)).on("mousedown",function(t){return function(s){var e,i;return i=t.getPlayPos(t.rect_tracks,t.wrapper_tracks_sub,s),i.y>=0?t.cueTracks(i.x,i.y):(i=t.getPos(t.rect_tracks,t.wrapper_tracks_sub,s,"tracks"),e=performance.now(),e-t.last_clicked<500&&-1!==i.y?(t.editPattern(i),t.last_clicked=-1e4):t.last_clicked=e,t.is_clicked=!0),t.click_pos=i}}(this)).on("mouseup",function(t){return function(s){var e;return e=t.getPos(t.rect_tracks,t.wrapper_tracks_sub,s,"tracks"),t.click_pos.x===e.x&&t.click_pos.y===e.y?t.selectCell(e):(t.click_pos.x!==e.x||t.click_pos.y!==e.y)&&t.copyCell(t.click_pos,e),t.is_clicked=!1}}(this)),this.canvas_master_hover_dom.on("mousemove",function(t){return function(s){var e;return e=t.getPos(t.rect_master,t.wrapper_master,s,"master"),t.is_clicked?t.drawDragMaster(t.ctx_master_hover,e):t.drawHover(t.ctx_master_hover,e)}}(this)).on("mouseout",function(t){return function(){return t.clearHover(t.ctx_master_hover),t.hover_pos={x:-1,y:-1},t.is_clicked=!1}}(this)).on("mousedown",function(t){return function(s){var e;return e=t.getPlayPos(t.rect_master,t.wrapper_master,s),e.y>=0?t.cueMaster(e.x,e.y):(e=t.getPos(t.rect_master,t.wrapper_master,s,"master"),t.is_clicked=!0),t.click_pos=e}}(this)).on("mouseup",function(t){return function(s){var e;return e=t.getPos(t.rect_master,t.wrapper_master,s,"master"),t.click_pos.x===e.x&&t.click_pos.y===e.y?t.selectCellMaster(e):(t.click_pos.x!==e.x||t.click_pos.y!==e.y)&&t.copyCellMaster(t.click_pos,e),t.is_clicked=!1}}(this)),this.wrapper_master.on("scroll",function(t){return function(){return t.wrapper_tracks_sub.scrollTop(t.wrapper_master.scrollTop())}}(this)),this.wrapper_tracks_sub.on("scroll",function(t){return function(){return t.wrapper_master.scrollTop(t.wrapper_tracks_sub.scrollTop())}}(this)),this.btn_save.on("click",function(t){return function(){return t.model.saveSong()}}(this)),this.dialog.on("mousedown",function(t){return function(s){return t.dialog_wrapper.is(s.target)||0!==t.dialog_wrapper.has(s.target).length?void 0:t.closeDialog()}}(this)),this.dialog_close.on("mousedown",function(t){return function(){return t.closeDialog()}}(this)),this.song_title.on("focus",function(){return function(){return window.keyboard.beginInput()}}(this)).on("change",function(t){return function(){return t.setSongTitle()}}(this)).on("blur",function(){return function(){return window.keyboard.endInput()}}(this)),this.song_creator.on("focus",function(){return function(){return window.keyboard.beginInput()}}(this)).on("change",function(t){return function(){return t.setCreatorName()}}(this)).on("blur",function(){return function(){return window.keyboard.endInput()}}(this)),this.social_twitter.on("click",function(t){return function(){return t.share("twitter")}}(this)),this.social_facebook.on("click",function(t){return function(){return t.share("facebook")}}(this)),this.social_hatena.on("click",function(t){return function(){return t.share("hatena")}}(this)),this.readSong(this.song,this.current_cells)},t.prototype.setSongTitle=function(){return this.song.title=this.song_title.val()},t.prototype.setCreatorName=function(){return this.song.creator=this.song_creator.val()},t.prototype.readSong=function(t,s){var e,i,r,h,o,a,c,n,l;for(this.song=t,this.current_cells=s,this.resize(),i=h=0,c=Math.max(this.song.tracks.length+1,8);c>=0?c>h:h>c;i=c>=0?++h:--h)for(e=this.song.tracks[i],null!=e&&(null!=e.type&&(this.track_color[i]=this.color_schemes[e.type]),null!=e.name&&this.drawTrackName(i,e.name)),r=o=0,n=Math.max(this.song.length+1,10);n>=0?n>o:o>n;r=n>=0?++o:--o)null!=e&&null!=e.patterns[r]?this.drawCellTracks(e.patterns[r],i,r):this.drawEmpty(this.ctx_tracks,i,r);for(this.drawMasterName(),r=a=0,l=Math.max(this.song.length+1,10);l>=0?l>a:a>l;r=l>=0?++a:--a)null!=this.song.master[r]?this.drawCellMaster(this.song.master[r],0,r):this.drawEmptyMaster(r);return this.drawScene(this.scene_pos,this.current_cells),this.selectCellMaster(this.select_pos),this.song_title.val(this.song.title),this.song_creator.val(this.song.creator)},t.prototype.drawCellTracks=function(t,s,e){return this.clearCell(this.ctx_tracks,s,e),null==this.track_color[s]&&(this.track_color[s]=this.color_schemes[this.song.tracks[s].type]),this.ctx_tracks.strokeStyle=this.track_color[s][1],this.ctx_tracks.lineWidth=1,this.ctx_tracks.strokeRect(s*this.w+2,e*this.h+2,this.w-2,this.h-2),this.ctx_tracks.drawImage(this.img_play,0,0,18,18,s*this.w+3,e*this.h+3,16,15),this.ctx_tracks.fillStyle=this.track_color[s][1],this.ctx_tracks.fillText(t.name,s*this.w+24,(e+1)*this.h-6)},t.prototype.drawCellMaster=function(t,s,e){return this.clearCell(this.ctx_master,s,e),this.ctx_master.strokeStyle=this.color[1],this.ctx_master.lineWidth=1,this.ctx_master.strokeRect(2,e*this.h+2,this.w_master-2,this.h-2),this.ctx_master.drawImage(this.img_play,0,0,18,18,3,e*this.h+3,16,15),this.ctx_master.fillStyle=this.color[1],this.ctx_master.fillText(t.name,24,(e+1)*this.h-6)},t.prototype.drawEmpty=function(t,s,e){return this.clearCell(t,s,e),t.strokeStyle=this.color[0],t.lineWidth=1,t.strokeRect(s*this.w+2,e*this.h+2,this.w-2,this.h-2)},t.prototype.drawEmptyMaster=function(t){return this.clearCell(this.ctx_master,0,t),this.ctx_master.strokeStyle=this.color[0],this.ctx_master.lineWidth=1,this.ctx_master.strokeRect(2,t*this.h+2,this.w_master-2,this.h-2),this.ctx_master.drawImage(this.img_play,0,0,18,18,3,t*this.h+3,16,15)},t.prototype.clearCell=function(t,s,e){return t===this.ctx_master?t.clearRect(0,e*this.h,this.w_master,this.h):t.clearRect(s*this.w,e*this.h,this.w,this.h)},t.prototype.drawMasterName=function(){var t,s,e;return e=this.ctx_master.measureText("MASTER"),t=(this.w-e.width)/2,s=(this.offset_y-this.font_size)/2,this.ctx_master.fillStyle="#ccc",this.ctx_master.fillText("MASTER",t+2,-s-3)},t.prototype.drawTrackName=function(t,s,e){var i,r,h;return null!=e&&(this.track_color[t]=this.color_schemes[e]),this.ctx_tracks.fillStyle=this.track_color[t][1],this.ctx_tracks.fillRect(t*this.w+2,-20,this.w-2,18),h=this.ctx_tracks.measureText(s),i=(this.w-h.width)/2,r=(this.offset_y-this.font_size)/2,this.ctx_tracks.shadowColor="#fff",this.ctx_tracks.shadowBlur=1,this.ctx_tracks.fillStyle="#fff",this.ctx_tracks.fillText(s,t*this.w+i+2,-r-3),this.ctx_tracks.shadowBlur=0},t.prototype.drawPatternName=function(t,s,e){return this.drawCellTracks(e,t,s)},t.prototype.drawSceneName=function(){},t.prototype.drawScene=function(t,s){var e,i,r;for(this.ctx_tracks_on.clearRect(0,this.scene_pos*this.h,8*this.w,this.h),this.ctx_master_on.clearRect(0,this.scene_pos*this.h,this.w,this.h),null!=s&&(this.current_cells=s),e=i=0,r=this.current_cells.length;r>=0?r>i:i>r;e=r>=0?++i:--i)null!=this.current_cells[e]&&this.drawActive(e,this.current_cells[e]);return this.drawActiveMaster(t),this.scene_pos=t,"tracks"===this.select_pos.type?this.selectCell(this.select_pos):"master"===this.select_pos.type?this.selectCellMaster(this.select_pos):void 0},t.prototype.drawActive=function(t,s){return this.clearActive(t),this.ctx_tracks_on.drawImage(this.img_play,36,0,18,18,t*this.w+3,s*this.h+3,16,15),this.last_active[t]=s},t.prototype.drawActiveMaster=function(t){return this.ctx_master_on.clearRect(0,0,this.w_master,1e4),this.ctx_master_on.drawImage(this.img_play,36,0,18,18,3,t*this.h+3,16,15)},t.prototype.drawDrag=function(t,s){var e;return this.clearHover(t),null==this.song.tracks[this.click_pos.x]||null==this.song.tracks[this.click_pos.x].patterns||null==this.song.tracks[this.click_pos.x].patterns[this.click_pos.y]||(e=this.song.tracks[this.click_pos.x].patterns[this.click_pos.y].name,s.y>=Math.max(this.song.length,10)||s.y<0)?void 0:(null==this.track_color[s.x]&&(this.track_color[s.x]=this.color_schemes[this.song.tracks[s.x].type]),t.fillStyle="rgba(255,255,255,1.0)",t.fillRect(s.x*this.w,s.y*this.h,this.w+2,this.h+2),t.strokeStyle=this.track_color[s.x][1],t.fillStyle=this.track_color[s.x][1],t.lineWidth=1,t.strokeRect(s.x*this.w+2,s.y*this.h+2,this.w-2,this.h-2),t.fillText(e,s.x*this.w+24,(s.y+1)*this.h-6),t.fillStyle="rgba(255,255,255,0.7)",t.fillRect(s.x*this.w,s.y*this.h,this.w+2,this.h+2),this.hover_pos=s)},t.prototype.drawDragMaster=function(t,s){var e;return this.clearHover(t),null==this.song.master[this.click_pos.y]||(e=this.song.master[this.click_pos.y].name,s.y>=Math.max(this.song.length,10))?void 0:(t.strokeStyle=this.color[1],t.fillStyle=this.color[1],t.lineWidth=1,t.strokeRect(2,s.y*this.h+2,this.w_master-2,this.h-2),t.fillText(e,24,(s.y+1)*this.h-6),t.fillStyle="rgba(255,255,255,0.7)",t.fillRect(0,s.y*this.h,this.w_master,this.h),this.hover_pos=s)},t.prototype.drawHover=function(t,s){return this.clearHover(t),t.fillStyle="rgba(255,255,255,0.6)",t===this.ctx_master_hover?t.fillRect(s.x*this.w,s.y*this.h,this.w_master,this.h):t.fillRect(s.x*this.w,s.y*this.h,this.w,this.h),this.hover_pos=s},t.prototype.clearHover=function(t){if(t===this.ctx_tracks_hover){if(t.clearRect(this.hover_pos.x*this.w,this.hover_pos.y*this.h,this.w+2,this.h+2),this.hover_pos.x===this.select_pos.x&&this.hover_pos.y===this.select_pos.y&&this.hover_pos.type===this.select_pos.type)return this.selectCell(this.select_pos)}else if(t.clearRect(0,this.hover_pos.y*this.h,this.w_master+2,this.h+2),this.hover_pos.x===this.select_pos.x&&this.hover_pos.y===this.select_pos.y&&this.hover_pos.type===this.select_pos.type)return this.selectCellMaster(this.select_pos)},t.prototype.clearActive=function(t){return this.ctx_tracks_on.clearRect(t*this.w,this.last_active[t]*this.h,this.w,this.h)},t.prototype.clearAllActive=function(){return this.ctx_tracks_on.clearRect(0,0,1e4,1e4),this.ctx_master_on.clearRect(0,0,1e4,1e4)},t.prototype.cueTracks=function(t,s){return null!=this.song.tracks[t]&&null!=this.song.tracks[t].patterns[s]?(this.model.cuePattern(t,s),this.ctx_tracks_on.drawImage(this.img_play,36,0,18,18,t*this.w+4,s*this.h+4,15,16),window.setTimeout(function(e){return function(){return e.ctx_tracks_on.clearRect(t*e.w+4,s*e.h+4,15,16)}}(this),100)):void 0},t.prototype.cueMaster=function(t,s){return null!=this.song.master[s]?(this.model.cueScene(s),this.ctx_master_on.drawImage(this.img_play,36,0,18,18,4,s*this.h+4,15,16),window.setTimeout(function(t){return function(){return t.ctx_master_on.clearRect(4,s*t.h+4,15,16)}}(this),100)):void 0},t.prototype.beat=function(t,s){var e,i,r,h;if(t)return e=s,this.ctx_master_on.drawImage(this.img_play,36,0,18,18,e[0]*this.w+3,e[1]*this.h+3,16,15),window.setTimeout(function(t){return function(){return t.ctx_master_on.clearRect(e[0]*t.w+3,e[1]*t.h+3,16,15)}}(this),100);for(h=[],i=0,r=s.length;r>i;i++)e=s[i],this.ctx_tracks_on.drawImage(this.img_play,36,0,18,18,e[0]*this.w+3,e[1]*this.h+3,16,15),h.push(window.setTimeout(function(t){return function(){return t.ctx_tracks_on.clearRect(e[0]*t.w+3,e[1]*t.h+3,16,15)}}(this),100));return h},t.prototype.editPattern=function(t){var s;return s=this.model.editPattern(t.x,t.y),this.drawCellTracks(s[2],s[0],s[1])},t.prototype.addSynth=function(t){return this.song=t,this.readSong(this.song,this.current_cells)},t.prototype.showSuccess=function(t,s,e){var i,r,h,o,a;return null!=s?(r=null!=e?'"'+s+'" by '+e:'"'+s+'"',h=r+" :: evil"):(r='"evil" by gmork',h="evil"),a="http://evil.gmork.in/"+t,history.pushState("",h,t),document.title=h,this.dialog.css({opacity:"1","z-index":"10000"}),this.dialog.find("#dialog-socials").show(),this.dialog.find("#dialog-success").show(),this.dialog.find("#dialog-error").hide(),this.dialog.find(".dialog-message-sub").text(a),o="http://twitter.com/intent/tweet?url="+encodeURI(a+"&text="+r+"&hashtags=evil"),i="http://www.facebook.com/sharer.php?&u="+a,this.dialog.find(".dialog-twitter").attr("href",o).click(function(t){return function(){return t.closeDialog()}}(this)),this.dialog.find(".dialog-facebook").attr("href",i).click(function(t){return function(){return t.closeDialog()}}(this))},t.prototype.showError=function(){return this.dialog.css({opacity:"1","z-index":"10000"}),this.dialog.find("#dialog-socials").hide(),this.dialog.find("#dialog-success").hide(),this.dialog.find("#dialog-error").show()},t.prototype.closeDialog=function(){return this.dialog.css({opacity:"1","z-index":"-10000"})},t.prototype.share=function(t){var s,e,i,r,h,o;return null!=this.song.title?(i=null!=this.song.creator?'"'+this.song.title+'" by '+this.song.creator:'"'+this.song.title+'"',r=i+" :: evil"):(i='"evil" by gmork',r="evil"),o=location.href,"twitter"===t?(h="http://twitter.com/intent/tweet?url="+encodeURI(o+"&text="+i+"&hashtags=evil"),window.open(h,"Tweet","width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1")):"facebook"===t?(s="http://www.facebook.com/sharer.php?&u="+o,window.open(s,"Share on facebook","width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1")):(e="http://b.hatena.ne.jp/entry/"+o.split("://")[1],window.open(e))},t.prototype.changeSynth=function(t){return this.song=t,this.readSong(this.song,this.current_cells)},t.prototype.copyCell=function(t,s){return null!=this.song.tracks[t.x]&&null!=this.song.tracks[t.x].patterns[t.y]&&(this.model.savePattern(t.x,t.y),null==this.song.tracks[s.x]&&(s.x=this.model.readTrack(this.song,t,s),this.current_cells.length=s.x+1,this.song.tracks[s.x].type=this.song.tracks[t.x].type),this.song.tracks[t.x].type===this.song.tracks[s.x].type)?(this.song.tracks[s.x].patterns[s.y]=$.extend(!0,{},this.song.tracks[t.x].patterns[t.y]),this.drawCellTracks(this.song.tracks[s.x].patterns[s.y],s.x,s.y),this.model.readPattern(this.song.tracks[s.x].patterns[s.y],s.x,s.y),this.drawCellMaster(this.song.master[s.y],0,s.y)):void 0},t.prototype.copyCellMaster=function(t,s){return null!=this.song.master[t.y]?(this.song.master[s.y]=$.extend(!0,{},this.song.master[t.y]),this.drawCellMaster(this.song.master[s.x],0,s.y),this.model.readMaster(this.song.master[s.y],s.y)):void 0},t.prototype.selectCell=function(t){return null!=this.song.tracks[t.x]&&null!=this.song.tracks[t.x].patterns[t.y]?(this.ctx_master_hover.clearRect(this.select_pos.x*this.w,this.select_pos.y*this.h,this.w_master,this.h),this.ctx_tracks_hover.clearRect(this.hover_pos.x*this.w,this.hover_pos.y*this.h,this.w,this.h),this.ctx_tracks_hover.clearRect(this.click_pos.x*this.w,this.click_pos.y*this.h,this.w,this.h),this.ctx_tracks_hover.clearRect(this.select_pos.x*this.w,this.select_pos.y*this.h,this.w,this.h),null==this.track_color[t.x]&&(this.track_color[t.x]=this.color_schemes[this.song.tracks[t.x].type]),this.ctx_tracks_hover.fillStyle=this.track_color[t.x][5],this.ctx_tracks_hover.fillRect(t.x*this.w+2,t.y*this.h+2,this.w-2,this.h-2),this.ctx_tracks_hover.fillStyle=this.track_color[t.x][1],this.ctx_tracks_hover.fillText(this.song.tracks[t.x].patterns[t.y].name,t.x*this.w+24,(t.y+1)*this.h-6),this.select_pos=t,this.select_pos.type="tracks",this.model.player.sidebar.show(this.song,this.select_pos)):void 0},t.prototype.selectCellMaster=function(t){return null!=this.song.master[t.y]?(this.ctx_tracks_hover.clearRect(this.select_pos.x*this.w,this.select_pos.y*this.h,this.w,this.h),this.ctx_master_hover.clearRect(0,this.hover_pos.y*this.h,this.w_master,this.h),this.ctx_master_hover.clearRect(0,this.click_pos.y*this.h,this.w_master,this.h),this.ctx_master_hover.clearRect(0,this.select_pos.y*this.h,this.w_master,this.h),this.ctx_master_hover.fillStyle=this.color[5],this.ctx_master_hover.fillRect(2,t.y*this.h+2,this.w_master-2,this.h-2),this.ctx_master_hover.fillStyle=this.color[1],this.ctx_master_hover.fillText(this.song.master[t.y].name,t.x*this.w_master+24,(t.y+1)*this.h-6),this.select_pos=t,this.select_pos.type="master",this.model.player.sidebar.show(this.song,this.select_pos)):void 0},t.prototype.getSelectPos=function(){return-1!==this.select_pos.x&&-1!==this.select_pos.y?this.select_pos:void 0},t}()}).call(this);