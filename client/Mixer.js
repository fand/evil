(function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};this.Mixer=function(){function e(e,s){var n,i,a,r,h;for(this.ctx=e,this.player=s,this.addMasterEffect=t(this.addMasterEffect,this),this.gain_master=1,this.gain_tracks=function(){var t,e,s,n;for(s=this.player.synth,n=[],t=0,e=s.length;e>t;t++)i=s[t],n.push(i.getGain());return n}.call(this),this.out=this.ctx.createGain(),this.out.gain.value=this.gain_master,this.send=this.ctx.createGain(),this.send.gain.value=1,this["return"]=this.ctx.createGain(),this["return"].gain.value=1,this.panners=[],this.analysers=[],this.splitter_master=this.ctx.createChannelSplitter(2),this.analyser_master=[this.ctx.createAnalyser(),this.ctx.createAnalyser()],this.out.connect(this.splitter_master),h=[0,1],a=0,r=h.length;r>a;a++)n=h[a],this.splitter_master.connect(this.analyser_master[n],n),this.analyser_master[n].fftSize=1024,this.analyser_master[n].minDecibels=-100,this.analyser_master[n].maxDecibels=0,this.analyser_master[n].smoothingTimeConstant=0;this.limiter=new Limiter(this.ctx),this.send.connect(this["return"]),this["return"].connect(this.limiter["in"]),this.limiter.connect(this.out),this.effects_master=[],this.out.connect(this.ctx.destination),this.view=new MixerView(this),setInterval(function(t){return function(){return t.drawGains()}}(this),30)}return e.prototype.drawGains=function(){var t,e,s,n,i,a;for(n=i=0,a=this.analysers.length;a>=0?a>i:i>a;n=a>=0?++i:--i)t=new Uint8Array(this.analysers[n].frequencyBinCount),this.analysers[n].getByteTimeDomainData(t),this.view.drawGainTracks(n,t);return e=new Uint8Array(this.analyser_master[0].frequencyBinCount),s=new Uint8Array(this.analyser_master[1].frequencyBinCount),this.analyser_master[0].getByteTimeDomainData(e),this.analyser_master[1].getByteTimeDomainData(s),this.view.drawGainMaster(e,s)},e.prototype.empty=function(){return this.gain_tracks=[],this.panners=[],this.analysers=[],this.view.empty()},e.prototype.addSynth=function(t){var e,s;return s=new Panner(this.ctx),t.connect(s["in"]),s.connect(this.send),this.panners.push(s),e=this.ctx.createAnalyser(),t.connect(e),this.analysers.push(e),this.view.addSynth(t)},e.prototype.removeSynth=function(t){return this.panners.splice(t)},e.prototype.setGains=function(t,e){var s,n,i;for(this.gain_tracks=t,this.gain_master=e,s=n=0,i=this.gain_tracks.length;i>=0?i>n:n>i;s=i>=0?++n:--n)this.player.synth[s].setGain(this.gain_tracks[s]);return this.out.gain.value=this.gain_master},e.prototype.setPans=function(t,e){var s,n,i,a;for(this.pan_tracks=t,this.pan_master=e,a=[],s=n=0,i=this.pan_tracks.length;i>=0?i>n:n>i;s=i>=0?++n:--n)a.push(this.panners[s].setPosition(this.pan_tracks[s]));return a},e.prototype.readGains=function(t,e){return this.gain_tracks=t,this.gain_master=e,this.setGains(this.gain_tracks,this.gain_master),this.view.readGains(this.gain_tracks,this.gain_master)},e.prototype.readPans=function(t,e){return this.pan_tracks=t,this.pan_master=e,this.setPans(this.pan_tracks,this.pan_master),this.view.readPans(this.pan_tracks,this.pan_master)},e.prototype.getParam=function(){return{gain_tracks:this.gain_tracks,gain_master:this.gain_master,pan_tracks:this.pan_tracks,pan_master:this.pan_master}},e.prototype.readParam=function(t){return null!=t?(this.readGains(t.gain_tracks,t.gain_master),this.readPans(t.pan_tracks,t.pan_master)):void 0},e.prototype.changeSynth=function(t,e){return e.connect(this.panners[t]["in"]),e.connect(this.analysers[t])},e.prototype.addMasterEffect=function(t){var e,s;return"Fuzz"===t?e=new Fuzz(this.ctx):"Delay"===t?e=new Delay(this.ctx):"Reverb"===t?e=new Reverb(this.ctx):"Comp"===t?e=new Compressor(this.ctx):"Double"===t&&(e=new Double(this.ctx)),s=this.effects_master.length,0===s?(this.send.disconnect(),this.send.connect(e["in"])):(this.effects_master[s-1].disconnect(),this.effects_master[s-1].connect(e["in"])),e.connect(this["return"]),e.setSource(this),this.effects_master.push(e),e},e.prototype.addTracksEffect=function(t,e){var s;return"Fuzz"===e?s=new Fuzz(this.ctx):"Delay"===e?s=new Delay(this.ctx):"Reverb"===e?s=new Reverb(this.ctx):"Comp"===e?s=new Compressor(this.ctx):"Double"===e&&(s=new Double(this.ctx)),this.player.synth[t].insertEffect(s),s},e.prototype.removeEffect=function(t){var e,s;return e=this.effects_master.indexOf(t),-1!==e?(s=0===e?this.send:this.effects_master[e-1],s.disconnect(),null!=this.effects_master[e+1]?s.connect(this.effects_master[e+1]):(s.connect(this["return"]),t.disconnect()),this.effects_master.splice(e,1)):void 0},e}()}).call(this);