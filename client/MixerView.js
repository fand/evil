(function(){this.MixerView=function(){function t(t){var s,a,n,i,r,e;for(this.model=t,this.dom=$("#mixer"),this.tracks=$("#mixer-tracks"),this.master=$("#mixer-master"),this.console_tracks=this.tracks.find("#console-tracks"),this.console_master=this.master.find("#console-master"),this.gains=this.tracks.find(".console-track > .gain-slider"),this.gain_master=this.master.find(".console-track > .gain-slider"),this.pans_label=this.tracks.find(".console-track > .pan-label"),this.pans=this.tracks.find(".console-track > .pan-slider"),this.pan_master=this.master.find(".console-track > .pan-slider"),this.canvas_tracks_dom=this.tracks.find(".vu-meter"),this.canvas_tracks=function(){var t,s,n,i;for(n=this.canvas_tracks_dom,i=[],t=0,s=n.length;s>t;t++)a=n[t],i.push(a[0]);return i}.call(this),this.ctx_tracks=function(){var t,a,n,i;for(n=this.canvas_tracks,i=[],t=0,a=n.length;a>t;t++)s=n[t],i.push(s.getContext("2d"));return i}.call(this),r=this.canvas_tracks,n=0,i=r.length;i>n;n++)s=r[n],e=[10,100],s.width=e[0],s.height=e[1];this.canvas_master_dom=this.master.find(".vu-meter"),this.canvas_master=this.canvas_master_dom[0],this.ctx_master=this.canvas_master.getContext("2d"),this.canvas_master.width=70,this.canvas_master.height=130,this.ctx_master.fillStyle="#fff",this.ctx_master.fillRect(10,0,50,130),this.track_dom=$("#templates > .console-track"),this.initEvent()}return t.prototype.initEvent=function(){return this.console_tracks.on("change",function(t){return function(){return t.setParams()}}(this)),this.console_master.on("change",function(t){return function(){return t.setParams()}}(this))},t.prototype.drawGainTracks=function(t,s){var a,n;return n=Math.max.apply(null,s),a=(n-128)/128*100,this.ctx_tracks[t].clearRect(0,0,10,100),this.ctx_tracks[t].fillStyle="#0df",this.ctx_tracks[t].fillRect(0,100-a,10,a)},t.prototype.drawGainMaster=function(t,s){var a,n,i,r;return i=Math.max.apply(null,t),r=Math.max.apply(null,s),a=(i-128)/128*130,n=(r-128)/128*130,this.ctx_master.clearRect(0,0,10,130),this.ctx_master.clearRect(60,0,10,130),this.ctx_master.fillStyle="#0df",this.ctx_master.fillRect(0,130-a,10,a),this.ctx_master.fillRect(60,130-n,10,n)},t.prototype.addSynth=function(){var t,s,a;return s=this.track_dom.clone(),this.console_tracks.append(s),this.pans.push(s.find(".pan-slider")),this.gains.push(s.find(".gain-slider")),this.pans_label.push(s.find(".pan-label")),t=s.find(".vu-meter"),this.canvas_tracks_dom.push(t),this.canvas_tracks.push(t[0]),this.ctx_tracks.push(t[0].getContext("2d")),a=[10,100],t[0].width=a[0],t[0].height=a[1],this.console_tracks.css({width:80*this.gains.length+2+"px"}),this.console_tracks.on("change",function(t){return function(){return t.setGains()}}(this)),this.setParams()},t.prototype.setGains=function(){var t,s,a;return t=function(){var t,s,n,i;for(n=this.gains,i=[],t=0,s=n.length;s>t;t++)a=n[t],i.push(parseFloat(a.val())/100);return i}.call(this),s=parseFloat(this.gain_master.val()/100),this.model.setGains(t,s)},t.prototype.setPans=function(){var t,s,a,n,i,r,e,h,c;for(a=function(){var t,s,a,n;for(a=this.pans,n=[],t=0,s=a.length;s>t;t++)e=a[t],n.push(1-parseFloat(e.val())/200);return n}.call(this),n=1-parseFloat(this.pan_master.val())/200,this.model.setPans(a,n),c=[],t=r=0,h=this.pans.length;h>=0?h>r:r>h;t=h>=0?++r:--r)s=parseInt(this.pans[t].val())-100,i=0===s?"C":0>s?-s+"% L":s+"% R",c.push(this.pans_label[t].text(i));return c},t.prototype.readGains=function(t,s){var a,n,i;for(a=n=0,i=t.length;i>=0?i>n:n>i;a=i>=0?++n:--n)this.gains[a].val(100*t[a]);return this.gain_master.val(100*s)},t.prototype.readPans=function(t){var s,a,n,i,r,e;for(e=[],s=i=0,r=t.length;r>=0?r>i:i>r;s=r>=0?++i:--i)this.pans[s].val(200*(1-t[s])),a=-1*(200*t[s]-100),n=0===a?"C":0>a?-a+"% L":a+"% R",e.push(this.pans_label[s].text(n));return e},t.prototype.setParams=function(){return this.setGains(),this.setPans()},t.prototype.displayGains=function(){},t.prototype.pan2pos=function(t){var s;return s=t*Math.PI,[Math.cos(s),0,-Math.sin(s)]},t.prototype.pos2pan=function(t){return Math.acos(t[0])/Math.PI},t.prototype.empty=function(){return this.console_tracks.empty(),this.canvas_tracks_dom=[],this.canvas_tracks=[],this.ctx_tracks=[],this.pans=[],this.gains=[],this.pans_label=[]},t}()}).call(this);