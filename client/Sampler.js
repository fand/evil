(function(){var t;this.SampleNode=function(){function e(e,a,s){var r,i,o,n,u,h,c,p;this.ctx=e,this.id=a,this.parent=s,this.out=this.ctx.createGain(),this.out.gain.value=1,this.name=t[this.id],this.setSample(this.name),this.head=0,this.tail=1,this.speed=1,this.merger=this.ctx.createChannelMerger(2),this.node_buf=this.ctx.createGain(),this.node_buf.gain.value=1,this.eq_gains=[0,0,0],n=[this.ctx.createBiquadFilter(),this.ctx.createBiquadFilter(),this.ctx.createBiquadFilter()],r=n[0],i=n[1],o=n[2],u=["lowshelf","peaking","highshelf"],r.type=u[0],i.type=u[1],o.type=u[2],h=[.6,.6,.6],r.Q.value=h[0],i.Q.value=h[1],o.Q.value=h[2],c=[350,2e3,4e3],r.frequency.value=c[0],i.frequency.value=c[1],o.frequency.value=c[2],p=this.eq_gains,r.gain.value=p[0],i.gain.value=p[1],o.gain.value=p[2],this.eq_nodes=[r,i,o],this.panner=new Panner(this.ctx),this.pan_value=.5,this.node_buf.connect(r),r.connect(i),i.connect(o),o.connect(this.panner["in"]),this.panner.connect(this.out)}return e.prototype.setSample=function(t){var e,a;return this.name=t,a=SAMPLES[this.name],null!=a?(this.sample=a,null!=a.data?this.buffer=a.data:(e=new XMLHttpRequest,e.open("GET",a.url,!0),e.responseType="arraybuffer",e.onload=function(t){return function(){return t.ctx.decodeAudioData(e.response,function(e){return t.buffer=e,t.buffer_duration=t.buffer.length/window.SAMPLE_RATE,t.parent.sampleLoaded(t.id)},function(t){return console.log("ajax error"),console.log(t)}),a.data=t.buffer}}(this),e.send())):void 0},e.prototype.connect=function(t){return this.dst=t,this.out.connect(this.dst)},e.prototype.noteOn=function(t,e){var a,s,r;if(null!=this.buffer)return null!=this.source_old&&this.source_old.stop(e),s=this.ctx.createBufferSource(),s.buffer=this.buffer,s.connect(this.merger,0,0),s.connect(this.merger,0,1),this.merger.connect(this.node_buf),a=e+this.buffer_duration*this.head,r=e+this.buffer_duration*this.tail,s.playbackRate.value=this.speed,s.start(0),this.node_buf.gain.value=t,this.source_old=s},e.prototype.setTimeParam=function(t,e,a){this.head=t,this.tail=e,this.speed=a},e.prototype.getTimeParam=function(){return[this.head,this.tail,this.speed]},e.prototype.setEQParam=function(t){var e,a;return this.eq_gains=t,a=function(){var t,a,s,r;for(s=this.eq_gains,r=[],t=0,a=s.length;a>t;t++)e=s[t],r.push(.2*e);return r}.call(this),this.eq_nodes[0].gain.value=a[0],this.eq_nodes[1].gain.value=a[1],this.eq_nodes[2].gain.value=a[2],a},e.prototype.getEQParam=function(){return this.eq_gains},e.prototype.setOutputParam=function(t,e){return this.pan_value=t,this.panner.setPosition(this.pan_value),this.out.gain.value=e},e.prototype.getOutputParam=function(){return[this.pan_value,this.out.gain.value]},e.prototype.getData=function(){return this.buffer},e.prototype.getParam=function(){return{wave:this.name,time:this.getTimeParam(),gains:this.eq_gains,output:this.getOutputParam()}},e.prototype.setParam=function(t){return null!=t.wave&&this.setSample(t.wave),null!=t.time&&this.setTimeParam(t.time[0],t.time[1],t.time[2]),null!=t.gains&&this.setEQParam(t.gains),null!=t.output?this.setOutputParam(t.output[0],t.output[1]):void 0},e}(),this.SamplerCore=function(){function t(t,e,a){var s,r;for(this.parent=t,this.ctx=e,this.id=a,this.node=this.ctx.createGain(),this.node.gain.value=1,this.gain=1,this.is_mute=!1,this.samples=function(){var t,e;for(e=[],s=t=0;10>t;s=++t)e.push(new SampleNode(this.ctx,s,this));return e}.call(this),s=r=0;10>r;s=++r)this.samples[s].connect(this.node);this.view=new SamplerCoreView(this,a,this.parent.view.dom.find(".sampler-core"))}return t.prototype.noteOn=function(t){var e,a,s,r,i;if(!this.is_mute&&(a=this.ctx.currentTime,Array.isArray(t))){for(i=[],s=0,r=t.length;r>s;s++)e=t[s],i.push(this.samples[e[0]-1].noteOn(e[1],a));return i}},t.prototype.noteOff=function(){var t;return t=this.ctx.currentTime},t.prototype.connect=function(t){return this.node.connect(t)},t.prototype.setSample=function(t,e){return this.samples[t].setSample(e)},t.prototype.setSampleTimeParam=function(t,e,a,s){return this.samples[t].setTimeParam(e,a,s)},t.prototype.setSampleEQParam=function(t,e,a,s){return this.samples[t].setEQParam([e,a,s])},t.prototype.setSampleOutputParam=function(t,e,a){return this.samples[t].setOutputParam(e,a)},t.prototype.setGain=function(t){return this.gain=t,this.node.gain.value=this.gain},t.prototype.getSampleTimeParam=function(t){return this.samples[t].getTimeParam()},t.prototype.getSampleData=function(t){return this.samples[t].getData()},t.prototype.getSampleEQParam=function(t){return this.samples[t].getEQParam()},t.prototype.getSampleOutputParam=function(t){return this.samples[t].getOutputParam()},t.prototype.sampleLoaded=function(t){return this.view.updateWaveformCanvas(t)},t.prototype.bindSample=function(t){return this.view.bindSample(t,this.samples[t].getParam()),this.view.setSampleTimeParam(this.getSampleTimeParam(t)),this.view.setSampleEQParam(this.getSampleEQParam(t)),this.view.setSampleOutputParam(this.getSampleOutputParam(t))},t.prototype.getParam=function(){var t;return{type:"SAMPLER",samples:function(){var e,a,s,r;for(s=this.samples,r=[],e=0,a=s.length;a>e;e++)t=s[e],r.push(t.getParam());return r}.call(this)}},t.prototype.setParam=function(t){var e,a,s;if(null!=t.samples)for(e=a=0,s=t.samples.length;s>=0?s>a:a>s;e=s>=0?++a:--a)this.samples[e].setParam(t.samples[e]);return this.bindSample(0)},t.prototype.mute=function(){return this.is_mute=!0},t.prototype.demute=function(){return this.is_mute=!1},t}(),this.Sampler=function(){function t(t,e,a,s){this.ctx=t,this.id=e,this.player=a,this.name=s,this.type="SAMPLER",null==this.name&&(this.name="Sampler #"+this.id),this.pattern_name="pattern 0",this.pattern=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],this.pattern_obj={name:this.pattern_name,pattern:this.pattern},this.time=0,this.view=new SamplerView(this,this.id),this.core=new SamplerCore(this,this.ctx,this.id),this.is_sustaining=!1,this.session=this.player.session,this.send=this.ctx.createGain(),this.send.gain.value=1,this["return"]=this.ctx.createGain(),this["return"].gain.value=1,this.core.connect(this.send),this.send.connect(this["return"]),this.effects=[]}return t.prototype.connect=function(t){return this["return"].connect(t instanceof Panner?t["in"]:t)},t.prototype.disconnect=function(){return this["return"].disconnect()},t.prototype.setDuration=function(){},t.prototype.setKey=function(){},t.prototype.setScale=function(){},t.prototype.setNote=function(t){return this.core.setNote(t)},t.prototype.setGain=function(t){return this.core.setGain(t)},t.prototype.getGain=function(){return this.core.gain},t.prototype.noteOn=function(t){return this.core.noteOn([[t,1]])},t.prototype.noteOff=function(){return this.core.noteOff()},t.prototype.playAt=function(t){var e,a;return this.time=t,e=this.time%this.pattern.length,this.view.playAt(e),0!==this.pattern[e]?(a=this.pattern[e],this.core.noteOn(a)):void 0},t.prototype.play=function(){return this.view.play()},t.prototype.stop=function(){return this.core.noteOff(),this.view.stop()},t.prototype.pause=function(){return this.core.noteOff()},t.prototype.setPattern=function(t){return this.pattern_obj=$.extend(!0,{},t),this.pattern=this.pattern_obj.pattern,this.pattern_name=this.pattern_obj.name,this.view.setPattern(this.pattern_obj)},t.prototype.getPattern=function(){return this.pattern_obj={name:this.pattern_name,pattern:this.pattern},$.extend(!0,{},this.pattern_obj)},t.prototype.clearPattern=function(){return this.pattern=[[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],this.pattern_obj.pattern=this.pattern,this.view.setPattern(this.pattern_obj)},t.prototype.plusPattern=function(){return this.pattern=this.pattern.concat([[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]),this.player.resetSceneLength()},t.prototype.minusPattern=function(){return this.pattern=this.pattern.slice(0,this.pattern.length-32),this.player.resetSceneLength()},t.prototype.addNote=function(t,e,a){var s,r,i;for(Array.isArray(this.pattern[t])||(this.pattern[t]=[[this.pattern[t],1]]),s=r=0,i=this.pattern[t].length;i>=0?i>r:r>i;s=i>=0?++r:--r)this.pattern[t][s][0]===e&&this.pattern[t].splice(s,1);return this.pattern[t].push([e,a])},t.prototype.removeNote=function(t){var e,a,s,r;for(r=[],e=a=0,s=this.pattern[t.x_abs].length;s>=0?s>a:a>s;e=s>=0?++a:--a)r.push(this.pattern[t.x_abs][e][0]===t.note?this.pattern[t.x_abs].splice(e,1):void 0);return r},t.prototype.activate=function(t){return this.view.activate(t)},t.prototype.inactivate=function(t){return this.view.inactivate(t)},t.prototype.redraw=function(t){return this.time=t,this.view.drawPattern(this.time)},t.prototype.setSynthName=function(t){return this.name=t,this.session.setSynthName(this.id,this.name),this.view.setSynthName(this.name)},t.prototype.inputPatternName=function(t){return this.pattern_name=t,this.session.setPatternName(this.id,this.pattern_name)},t.prototype.setPatternName=function(t){return this.pattern_name=t,this.view.setPatternName(this.pattern_name)},t.prototype.selectSample=function(t){return this.core.bindSample(t)},t.prototype.changeSynth=function(t){var e;return e=this.player.changeSynth(this.id,t,e),this.view.dom.replaceWith(e.view.dom),this.noteOff(!0),this.disconnect()},t.prototype.getParam=function(){var t;return t=this.core.getParam(),t.name=this.name,t.effects=this.getEffectsParam(),t},t.prototype.setParam=function(t){return null!=t?this.core.setParam(t):void 0},t.prototype.mute=function(){return this.core.mute()},t.prototype.demute=function(){return this.core.demute()},t.prototype.getEffectsParam=function(){var t,e,a,s,r;for(s=this.effects,r=[],e=0,a=s.length;a>e;e++)t=s[e],r.push(t.getParam());return r},t.prototype.insertEffect=function(t){return 0===this.effects.length?(this.send.disconnect(),this.send.connect(t["in"])):(this.effects[this.effects.length-1].disconnect(),this.effects[this.effects.length-1].connect(t["in"])),t.connect(this["return"]),t.setSource(this),this.effects.push(t)},t.prototype.removeEffect=function(t){var e,a;return e=this.effects.indexOf(t),-1!==e?(a=0===e?this.send:this.effects[e-1],a.disconnect(),a.connect(null!=this.effects[e+1]?this.effects[e+1]["in"]:this["return"]),t.disconnect(),this.effects.splice(e,1)):void 0},t}(),t=["bd_909dwsd","bd_sub808","snr_drm909kit1","snr_mpc","clp_raw","clp_basics","hat_lilcloser","hat_nice909open","shaker_bot","tam_lifein2d"],this.SAMPLES={kick1:{url:"static/wav/kick1.wav"},kick2:{url:"static/wav/kick2.wav"},snare1:{url:"static/wav/snare1.wav"},snare2:{url:"static/wav/snare2.wav"},clap:{url:"static/wav/clap.wav"},hat_closed:{url:"static/wav/hat_closed.wav"},hat_open:{url:"static/wav/hat_open.wav"},ride:{url:"static/wav/ride.wav"},bd_909dwsd:{url:"static/wav/deep_house/bd_kick/bd_909dwsd.wav"},bd_chicago:{url:"static/wav/deep_house/bd_kick/bd_chicago.wav"},bd_dandans:{url:"static/wav/deep_house/bd_kick/bd_dandans.wav"},bd_deephouser:{url:"static/wav/deep_house/bd_kick/bd_deephouser.wav"},bd_diesel:{url:"static/wav/deep_house/bd_kick/bd_diesel.wav"},bd_dropped:{url:"static/wav/deep_house/bd_kick/bd_dropped.wav"},bd_flir:{url:"static/wav/deep_house/bd_kick/bd_flir.wav"},bd_gas:{url:"static/wav/deep_house/bd_kick/bd_gas.wav"},bd_ghost:{url:"static/wav/deep_house/bd_kick/bd_ghost.wav"},bd_hybrid:{url:"static/wav/deep_house/bd_kick/bd_hybrid.wav"},bd_isampleoldskool:{url:"static/wav/deep_house/bd_kick/bd_isampleoldskool.wav"},bd_liked:{url:"static/wav/deep_house/bd_kick/bd_liked.wav"},bd_mainroom:{url:"static/wav/deep_house/bd_kick/bd_mainroom.wav"},bd_mirror:{url:"static/wav/deep_house/bd_kick/bd_mirror.wav"},bd_nash:{url:"static/wav/deep_house/bd_kick/bd_nash.wav"},bd_newyear:{url:"static/wav/deep_house/bd_kick/bd_newyear.wav"},bd_organicisin:{url:"static/wav/deep_house/bd_kick/bd_organicisin.wav"},bd_outdoor:{url:"static/wav/deep_house/bd_kick/bd_outdoor.wav"},bd_shoein:{url:"static/wav/deep_house/bd_kick/bd_shoein.wav"},bd_sodeep:{url:"static/wav/deep_house/bd_kick/bd_sodeep.wav"},bd_sonikboom:{url:"static/wav/deep_house/bd_kick/bd_sonikboom.wav"},bd_streek:{url:"static/wav/deep_house/bd_kick/bd_streek.wav"},bd_stripped:{url:"static/wav/deep_house/bd_kick/bd_stripped.wav"},bd_sub808:{url:"static/wav/deep_house/bd_kick/bd_sub808.wav"},bd_tech:{url:"static/wav/deep_house/bd_kick/bd_tech.wav"},bd_tripper:{url:"static/wav/deep_house/bd_kick/bd_tripper.wav"},bd_uma:{url:"static/wav/deep_house/bd_kick/bd_uma.wav"},bd_untitled:{url:"static/wav/deep_house/bd_kick/bd_untitled.wav"},bd_vintager:{url:"static/wav/deep_house/bd_kick/bd_vintager.wav"},bd_vinylinstereo:{url:"static/wav/deep_house/bd_kick/bd_vinylinstereo.wav"},snr_analogging:{url:"static/wav/deep_house/snare/snr_analogging.wav"},snr_answer8bit:{url:"static/wav/deep_house/snare/snr_answer8bit.wav"},snr_bland:{url:"static/wav/deep_house/snare/snr_bland.wav"},snr_drm909kit:{url:"static/wav/deep_house/snare/snr_drm909kit.wav"},snr_dwreal:{url:"static/wav/deep_house/snare/snr_dwreal.wav"},snr_housey:{url:"static/wav/deep_house/snare/snr_housey.wav"},snr_mpc:{url:"static/wav/deep_house/snare/snr_mpc.wav"},snr_myclassicsnare:{url:"static/wav/deep_house/snare/snr_myclassicsnare.wav"},snr_owned:{url:"static/wav/deep_house/snare/snr_owned.wav"},snr_royalty:{url:"static/wav/deep_house/snare/snr_royalty.wav"},snr_rusnarious:{url:"static/wav/deep_house/snare/snr_rusnarious.wav"},snr_truevintage:{url:"static/wav/deep_house/snare/snr_truevintage.wav"},clp_analogue:{url:"static/wav/deep_house/clap/clp_analogue.wav"},clp_applause:{url:"static/wav/deep_house/clap/clp_applause.wav"},clp_basics:{url:"static/wav/deep_house/clap/clp_basics.wav"},clp_can:{url:"static/wav/deep_house/clap/clp_can.wav"},clp_clap10000:{url:"static/wav/deep_house/clap/clp_clap10000.wav"},clp_classic:{url:"static/wav/deep_house/clap/clp_classic.wav"},clp_clipper:{url:"static/wav/deep_house/clap/clp_clipper.wav"},clp_delma:{url:"static/wav/deep_house/clap/clp_delma.wav"},clp_donuts:{url:"static/wav/deep_house/clap/clp_donuts.wav"},clp_drastik:{url:"static/wav/deep_house/clap/clp_drastik.wav"},clp_eternity:{url:"static/wav/deep_house/clap/clp_eternity.wav"},clp_happiness:{url:"static/wav/deep_house/clap/clp_happiness.wav"},clp_kiddo:{url:"static/wav/deep_house/clap/clp_kiddo.wav"},clp_knowledge:{url:"static/wav/deep_house/clap/clp_knowledge.wav"},clp_kournikova:{url:"static/wav/deep_house/clap/clp_kournikova.wav"},clp_raw:{url:"static/wav/deep_house/clap/clp_raw.wav"},clp_scorch:{url:"static/wav/deep_house/clap/clp_scorch.wav"},clp_socute:{url:"static/wav/deep_house/clap/clp_socute.wav"},clp_sustained:{url:"static/wav/deep_house/clap/clp_sustained.wav"},clp_tayo:{url:"static/wav/deep_house/clap/clp_tayo.wav"},clp_tense:{url:"static/wav/deep_house/clap/clp_tense.wav"},clp_thinlayer:{url:"static/wav/deep_house/clap/clp_thinlayer.wav"},clp_verona:{url:"static/wav/deep_house/clap/clp_verona.wav"},hat_626:{url:"static/wav/deep_house/hats/hat_626.wav"},hat_ace:{url:"static/wav/deep_house/hats/hat_ace.wav"},hat_addverb:{url:"static/wav/deep_house/hats/hat_addverb.wav"},hat_analog:{url:"static/wav/deep_house/hats/hat_analog.wav"},hat_bebias:{url:"static/wav/deep_house/hats/hat_bebias.wav"},hat_bestfriend:{url:"static/wav/deep_house/hats/hat_bestfriend.wav"},hat_bigdeal:{url:"static/wav/deep_house/hats/hat_bigdeal.wav"},hat_blackmamba:{url:"static/wav/deep_house/hats/hat_blackmamba.wav"},hat_chart:{url:"static/wav/deep_house/hats/hat_chart.wav"},hat_charter:{url:"static/wav/deep_house/hats/hat_charter.wav"},hat_chipitaka:{url:"static/wav/deep_house/hats/hat_chipitaka.wav"},hat_classical:{url:"static/wav/deep_house/hats/hat_classical.wav"},hat_classichousehat:{url:"static/wav/deep_house/hats/hat_classichousehat.wav"},hat_closer:{url:"static/wav/deep_house/hats/hat_closer.wav"},hat_collective:{url:"static/wav/deep_house/hats/hat_collective.wav"},hat_crackers:{url:"static/wav/deep_house/hats/hat_crackers.wav"},hat_critters:{url:"static/wav/deep_house/hats/hat_critters.wav"},hat_cuppa:{url:"static/wav/deep_house/hats/hat_cuppa.wav"},hat_darkstar:{url:"static/wav/deep_house/hats/hat_darkstar.wav"},hat_deephouseopen:{url:"static/wav/deep_house/hats/hat_deephouseopen.wav"},hat_drawn:{url:"static/wav/deep_house/hats/hat_drawn.wav"},hat_freekn:{url:"static/wav/deep_house/hats/hat_freekn.wav"},hat_gater:{url:"static/wav/deep_house/hats/hat_gater.wav"},hat_glitchbitch:{url:"static/wav/deep_house/hats/hat_glitchbitch.wav"},hat_hatgasm:{url:"static/wav/deep_house/hats/hat_hatgasm.wav"},hat_hattool:{url:"static/wav/deep_house/hats/hat_hattool.wav"},hat_jelly:{url:"static/wav/deep_house/hats/hat_jelly.wav"},hat_kate:{url:"static/wav/deep_house/hats/hat_kate.wav"},hat_lights:{url:"static/wav/deep_house/hats/hat_lights.wav"},hat_lilcloser:{url:"static/wav/deep_house/hats/hat_lilcloser.wav"},hat_mydustyhouse:{url:"static/wav/deep_house/hats/hat_mydustyhouse.wav"},hat_myfavouriteopen:{url:"static/wav/deep_house/hats/hat_myfavouriteopen.wav"},hat_negative6:{url:"static/wav/deep_house/hats/hat_negative6.wav"},hat_nice909open:{url:"static/wav/deep_house/hats/hat_nice909open.wav"},hat_niner0niner:{url:"static/wav/deep_house/hats/hat_niner0niner.wav"},hat_omgopen:{url:"static/wav/deep_house/hats/hat_omgopen.wav"},hat_openiner:{url:"static/wav/deep_house/hats/hat_openiner.wav"},hat_original:{url:"static/wav/deep_house/hats/hat_original.wav"},hat_quentin:{url:"static/wav/deep_house/hats/hat_quentin.wav"},hat_rawsample:{url:"static/wav/deep_house/hats/hat_rawsample.wav"},hat_retired:{url:"static/wav/deep_house/hats/hat_retired.wav"},hat_sampleking:{url:"static/wav/deep_house/hats/hat_sampleking.wav"},hat_samplekingdom:{url:"static/wav/deep_house/hats/hat_samplekingdom.wav"},hat_sharp:{url:"static/wav/deep_house/hats/hat_sharp.wav"},hat_soff:{url:"static/wav/deep_house/hats/hat_soff.wav"},hat_spreadertrick:{url:"static/wav/deep_house/hats/hat_spreadertrick.wav"},hat_stereosonic:{url:"static/wav/deep_house/hats/hat_stereosonic.wav"},hat_tameit:{url:"static/wav/deep_house/hats/hat_tameit.wav"},hat_vintagespread:{url:"static/wav/deep_house/hats/hat_vintagespread.wav"},hat_void:{url:"static/wav/deep_house/hats/hat_void.wav"},shaker_bot:{url:"static/wav/deep_house/shaker_tambourine/shaker_bot.wav"},shaker_broom:{url:"static/wav/deep_house/shaker_tambourine/shaker_broom.wav"},shaker_command:{url:"static/wav/deep_house/shaker_tambourine/shaker_command.wav"},shaker_halfshake:{url:"static/wav/deep_house/shaker_tambourine/shaker_halfshake.wav"},shaker_pause:{url:"static/wav/deep_house/shaker_tambourine/shaker_pause.wav"},shaker_quicky:{url:"static/wav/deep_house/shaker_tambourine/shaker_quicky.wav"},shaker_really:{url:"static/wav/deep_house/shaker_tambourine/shaker_really.wav"},tam_christmassy:{url:"static/wav/deep_house/shaker_tambourine/tam_christmassy.wav"},tam_extras:{url:"static/wav/deep_house/shaker_tambourine/tam_extras.wav"},tam_hohoho:{url:"static/wav/deep_house/shaker_tambourine/tam_hohoho.wav"},tam_lifein2d:{url:"static/wav/deep_house/shaker_tambourine/tam_lifein2d.wav"},tam_mrhat:{url:"static/wav/deep_house/shaker_tambourine/tam_mrhat.wav"},tom_909fatty:{url:"static/wav/deep_house/toms/tom_909fatty.wav"},tom_909onvinyl:{url:"static/wav/deep_house/toms/tom_909onvinyl.wav"},tom_cleansweep:{url:"static/wav/deep_house/toms/tom_cleansweep.wav"},tom_dept:{url:"static/wav/deep_house/toms/tom_dept.wav"},tom_discodisco:{url:"static/wav/deep_house/toms/tom_discodisco.wav"},tom_eclipse:{url:"static/wav/deep_house/toms/tom_eclipse.wav"},tom_enriched:{url:"static/wav/deep_house/toms/tom_enriched.wav"},tom_enrico:{url:"static/wav/deep_house/toms/tom_enrico.wav"},tom_greatwhite:{url:"static/wav/deep_house/toms/tom_greatwhite.wav"},tom_iloveroland:{url:"static/wav/deep_house/toms/tom_iloveroland.wav"},tom_madisonave:{url:"static/wav/deep_house/toms/tom_madisonave.wav"},tom_ofalltoms:{url:"static/wav/deep_house/toms/tom_ofalltoms.wav"},tom_summerdayze:{url:"static/wav/deep_house/toms/tom_summerdayze.wav"},tom_taste:{url:"static/wav/deep_house/toms/tom_taste.wav"},tom_vsneve:{url:"static/wav/deep_house/toms/tom_vsneve.wav"},prc_808rimmer:{url:"static/wav/deep_house/percussion/prc_808rimmer.wav"},prc_bigdrum:{url:"static/wav/deep_house/percussion/prc_bigdrum.wav"},prc_bongodrm:{url:"static/wav/deep_house/percussion/prc_bongodrm.wav"},prc_bongorock:{url:"static/wav/deep_house/percussion/prc_bongorock.wav"},prc_boxed:{url:"static/wav/deep_house/percussion/prc_boxed.wav"},prc_change:{url:"static/wav/deep_house/percussion/prc_change.wav"},prc_clav:{url:"static/wav/deep_house/percussion/prc_clav.wav"},prc_congaz:{url:"static/wav/deep_house/percussion/prc_congaz.wav"},prc_dnthavacowman:{url:"static/wav/deep_house/percussion/prc_dnthavacowman.wav"},prc_drop:{url:"static/wav/deep_house/percussion/prc_drop.wav"},prc_emtythepot:{url:"static/wav/deep_house/percussion/prc_emtythepot.wav"},prc_flickingabucket:{url:"static/wav/deep_house/percussion/prc_flickingabucket.wav"},prc_foryoursampler:{url:"static/wav/deep_house/percussion/prc_foryoursampler.wav"},prc_harmony:{url:"static/wav/deep_house/percussion/prc_harmony.wav"},prc_hit:{url:"static/wav/deep_house/percussion/prc_hit.wav"},prc_home:{url:"static/wav/deep_house/percussion/prc_home.wav"},prc_itgoespop:{url:"static/wav/deep_house/percussion/prc_itgoespop.wav"},prc_jungledrummer:{url:"static/wav/deep_house/percussion/prc_jungledrummer.wav"},prc_knockknock:{url:"static/wav/deep_house/percussion/prc_knockknock.wav"},prc_reworked:{url:"static/wav/deep_house/percussion/prc_reworked.wav"},prc_rolled:{url:"static/wav/deep_house/percussion/prc_rolled.wav"},prc_syntheticlav:{url:"static/wav/deep_house/percussion/prc_syntheticlav.wav"},prc_trainstation:{url:"static/wav/deep_house/percussion/prc_trainstation.wav"},prc_u5510n:{url:"static/wav/deep_house/percussion/prc_u5510n.wav"},prc_vinylshot:{url:"static/wav/deep_house/percussion/prc_vinylshot.wav"},prc_virustiatmos:{url:"static/wav/deep_house/percussion/prc_virustiatmos.wav"},prc_youpanit:{url:"static/wav/deep_house/percussion/prc_youpanit.wav"},cym_crashtest:{url:"static/wav/deep_house/ride_cymbal/cym_crashtest.wav"},cym_gatecrashed:{url:"static/wav/deep_house/ride_cymbal/cym_gatecrashed.wav"},ride_8bitdirty:{url:"static/wav/deep_house/ride_cymbal/ride_8bitdirty.wav"},ride_cymbal1:{url:"static/wav/deep_house/ride_cymbal/ride_cymbal1.wav"},ride_full:{url:"static/wav/deep_house/ride_cymbal/ride_full.wav"},ride_jules:{url:"static/wav/deep_house/ride_cymbal/ride_jules.wav"},ride_mpc60:{url:"static/wav/deep_house/ride_cymbal/ride_mpc60.wav"}}}).call(this);