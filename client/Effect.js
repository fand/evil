(function(){var t,i,e={}.hasOwnProperty,a=function(t,i){function a(){this.constructor=t}for(var s in i)e.call(i,s)&&(t[s]=i[s]);return a.prototype=i.prototype,t.prototype=new a,t.__super__=i.prototype,t};this.FX=function(){function t(t){this.ctx=t,this["in"]=this.ctx.createGain(),this["in"].gain.value=1,this.dry=this.ctx.createGain(),this.dry.gain.value=1,this.wet=this.ctx.createGain(),this.wet.gain.value=1,this.out=this.ctx.createGain(),this.out.gain.value=1}return t.prototype.connect=function(t){return this.out.connect(t)},t.prototype.disconnect=function(){return this.out.disconnect()},t.prototype.setInput=function(t){return this["in"].gain.value=t},t.prototype.setOutput=function(t){return this.out.gain.value=t},t.prototype.setDry=function(t){return this.dry.gain.value=t},t.prototype.setWet=function(t){return this.wet.gain.value=t},t.prototype.appendTo=function(t){return $(t).append(this.view.dom),this.view.initEvent()},t.prototype.remove=function(){return this.source.removeEffect(this)},t.prototype.setSource=function(t){this.source=t},t}(),this.Delay=function(t){function i(t){this.ctx=t,i.__super__.constructor.call(this,this.ctx),this.delay=this.ctx.createDelay(),this.delay.delayTime.value=.23,this.lofi=this.ctx.createBiquadFilter(),this.lofi.type="peaking",this.lofi.frequency.value=1200,this.lofi.Q.value=0,this.lofi.gain.value=1,this.feedback=this.ctx.createGain(),this.feedback.gain.value=.2,this["in"].connect(this.lofi),this.lofi.connect(this.delay),this.delay.connect(this.wet),this.delay.connect(this.feedback),this.feedback.connect(this.lofi),this.wet.connect(this.out),this["in"].connect(this.out),this.view=new DelayView(this)}return a(i,t),i.prototype.setDelay=function(t){return this.delay.delayTime.value=t},i.prototype.setFeedback=function(t){return this.feedback.gain.value=t},i.prototype.setLofi=function(t){return this.lofi.Q.value=t},i.prototype.setParam=function(t){return null!=t.delay&&this.setDelay(t.delay),null!=t.feedback&&this.setFeedback(t.feedback),null!=t.lofi&&this.setLofi(t.lofi),null!=t.wet&&this.setWet(t.wet),this.view.setParam(t)},i.prototype.getParam=function(){return{effect:"Delay",delay:this.delay.delayTime.value,feedback:this.feedback.gain.value,lofi:this.lofi.Q.value,wet:this.wet.gain.value}},i}(this.FX),this.Reverb=function(e){function s(t){this.ctx=t,s.__super__.constructor.call(this,this.ctx),this.reverb=this.ctx.createConvolver(),this["in"].connect(this.reverb),this.reverb.connect(this.wet),this.wet.connect(this.out),this["in"].connect(this.out),this.setIR("BIG_SNARE"),this.view=new ReverbView(this)}return a(s,e),s.prototype.setIR=function(e){var a,s;return this.name=e,null!=t[e]?void(this.reverb.buffer=t[e]):(s=i[e],null!=s?(a=new XMLHttpRequest,a.open("GET",s,!0),a.responseType="arraybuffer",a.onload=function(i){return function(){return i.ctx.decodeAudioData(a.response,function(a){return i.reverb.buffer=a,t[e]=a},function(t){return console.log("ajax error"),console.log(t)})}}(this),a.send()):void 0)},s.prototype.setParam=function(t){return null!=t.name&&this.setIR(t.name),null!=t.wet&&this.setWet(t.wet),this.view.setParam(t)},s.prototype.getParam=function(){return{effect:"Reverb",name:this.name,wet:this.wet.gain.value}},s}(this.FX),this.Compressor=function(t){function i(t){this.ctx=t,i.__super__.constructor.call(this,this.ctx),this.comp=this.ctx.createDynamicsCompressor(),this["in"].connect(this.comp),this.comp.connect(this.out),this["in"].gain.value=1,this.out.gain.value=1,this.view=new CompressorView(this)}return a(i,t),i.prototype.setAttack=function(t){return this.comp.attack.value=t},i.prototype.setRelease=function(t){return this.comp.release.value=t},i.prototype.setThreshold=function(t){return this.comp.threshold.value=t},i.prototype.setRatio=function(t){return this.comp.ratio.value=t},i.prototype.setKnee=function(t){return this.comp.knee.value=t},i.prototype.setParam=function(t){return null!=t.attack&&this.setAttack(t.attack),null!=t.release&&this.setRelease(t.release),null!=t.threshold&&this.setThreshold(t.threshold),null!=t.ratio&&this.setRatio(t.ratio),null!=t.knee&&this.setKnee(t.knee),null!=t.input&&this.setInput(t.input),null!=t.output&&this.setOutput(t.output),this.view.setParam(t)},i.prototype.getParam=function(){return{effect:"Compressor",attack:this.comp.attack.value,release:this.comp.release.value,threshold:this.comp.threshold.value,ratio:this.comp.ratio.value,knee:this.comp.knee.value,input:this["in"].gain.value,output:this.out.gain.value}},i}(this.FX),this.Limiter=function(){function t(t){this.ctx=t,this["in"]=this.ctx.createDynamicsCompressor(),this.out=this.ctx.createDynamicsCompressor(),this["in"].connect(this.out),this["in"].threshold.value=-6,this.out.threshold.value=-10,this.out.ratio.value=20}return t.prototype.connect=function(t){return this.out.connect(t)},t}(),this.Fuzz=function(t){function i(t){this.ctx=t,i.__super__.constructor.call(this,this.ctx),this.fuzz=this.ctx.createWaveShaper(),this["in"].connect(this.fuzz),this.fuzz.connect(this.out),this["in"].gain.value=1,this.out.gain.value=1,this.type="Sigmoid",this.samples=2048,this.fuzz.curve=new Float32Array(this.samples),this.setGain(.08),this.view=new FuzzView(this)}return a(i,t),i.prototype.setType=function(t){this.type=t},i.prototype.setGain=function(t){var i,e,a,s,R,_,n,c,o,E,r;if(this.gain=t,a=2/(1+Math.exp(1*-this.gain))-1,e=1/a,"Sigmoid"===this.type){for(E=[],i=_=0,c=this.samples;c>=0?c>_:_>c;i=c>=0?++_:--_)R=2*i/this.samples-1,s=2/(1+Math.exp(1e3*-Math.pow(this.gain,3)*R))-1,E.push(this.fuzz.curve[i]=s*e);return E}if("Octavia"===this.type){for(r=[],i=n=0,o=this.samples;o>=0?o>n:n>o;i=o>=0?++n:--n)R=2*i/this.samples-1,s=2/(1+Math.exp(10*-Math.pow(this.gain,2)*R))-1,r.push(this.fuzz.curve[i]=2*Math.abs(s*e)-1);return r}},i.prototype.setParam=function(t){return null!=t.type&&this.setType(t.type),null!=t.gain&&this.setGain(t.gain),null!=t.input&&this.setInput(t.input),null!=t.output&&this.setOutput(t.output),this.view.setParam(t)},i.prototype.getParam=function(){return{effect:"Fuzz",type:this.type,gain:this.gain,input:this["in"].gain.value,output:this.out.gain.value}},i}(this.FX),this.Double=function(t){function i(t){this.ctx=t,i.__super__.constructor.call(this,this.ctx),this.delay=this.ctx.createDelay(),this.delay.delayTime.value=.03,this.pan_l=new Panner(this.ctx),this.pan_r=new Panner(this.ctx),this.setWidth([0,0,-1]),this["in"].connect(this.pan_l["in"]),this["in"].connect(this.delay),this.delay.connect(this.pan_r["in"]),this.pan_l.connect(this.out),this.pan_r.connect(this.out),this.out.gain.value=.6,this.view=new DoubleView(this)}return a(i,t),i.prototype.setDelay=function(t){return this.delay.delayTime.value=t},i.prototype.setWidth=function(t){return this.pos=t,this.pan_l.setPosition(this.pos),this.pan_r.setPosition(-this.pos)},i.prototype.setParam=function(t){return null!=t.delay&&this.setDelay(t.delay),null!=t.width&&this.setWidth(t.width),this.view.setParam(t)},i.prototype.getParam=function(){return{effect:"Double",delay:this.delay.delayTime.value,width:this.pos}},i}(this.FX),i={BIG_SNARE:"static/IR/H3000/206_BIG_SNARE.wav",Sweep_Reverb:"static/IR/H3000/106_Sweep_Reverb.wav",Reverb_Factory:"static/IR/H3000/107_Reverb_Factory.wav",Dense_Room:"static/IR/H3000/114_Dense_Room.wav","8_SEC_REVERB":"static/IR/H3000/154_8_SEC_REVERB.wav",GUITAR_ROOM:"static/IR/H3000/178_GUITAR_ROOM.wav",HUNTER_DELAY:"static/IR/H3000/181_HUNTER_DELAY.wav",JERRY_RACE_CAR:"static/IR/H3000/182_JERRY_RACE_CAR.wav",ResoVibroEee:"static/IR/H3000/192_ResoVibroEee.wav",ROOM_OF_DOOM:"static/IR/H3000/193_ROOM_OF_DOOM.wav","RHYTHM_&_REVERB":"static/IR/H3000/194_RHYTHM_&_REVERB.wav",BIG_SNARE:"static/IR/H3000/206_BIG_SNARE.wav",BIG_SWEEP:"static/IR/H3000/207_BIG_SWEEP.wav",BRIGHT_ROOM:"static/IR/H3000/209_BRIGHT_ROOM.wav",CANYON:"static/IR/H3000/211_CANYON.wav",DARK_ROOM:"static/IR/H3000/213_DARK_ROOM.wav","DISCRETE-VERB":"static/IR/H3000/215_DISCRETE-VERB.wav","EXPLODING_'VERB":"static/IR/H3000/219_EXPLODING_'VERB.wav",GATED_REVERB:"static/IR/H3000/223_GATED_REVERB.wav",LOCKER_ROOM:"static/IR/H3000/230_LOCKER_ROOM.wav",RANDOM_GATE:"static/IR/H3000/240_RANDOM_GATE.wav",REVERSE_GATE:"static/IR/H3000/241_REVERSE_GATE.wav",RICH_PLATE:"static/IR/H3000/243_RICH_PLATE.wav",SHIMMERISH:"static/IR/H3000/246_SHIMMERISH.wav",SMALL_ROOM:"static/IR/H3000/248_SMALL_ROOM.wav",TONAL_ROOM:"static/IR/H3000/254_TONAL_ROOM.wav",WARM_HALL:"static/IR/H3000/257_WARM_HALL.wav","THRAX-VERB":"static/IR/H3000/261_THRAX-VERB.wav",TWIRLING_ROOM:"static/IR/H3000/262_TWIRLING_ROOM.wav",USEFUL_VERB:"static/IR/H3000/265_USEFUL_VERB.wav",FLUTTEROUS_ROOM:"static/IR/H3000/278_FLUTTEROUS_ROOM.wav",MARKS_MED_DARK:"static/IR/H3000/282_MARKS_MED_DARK.wav",LG_GUITAR_ROOM:"static/IR/H3000/283_LG_GUITAR_ROOM.wav",ACCURATE_ROOM:"static/IR/H3000/368_ACCURATE_ROOM.wav",BASS_SPACE:"static/IR/H3000/371_BASS_SPACE.wav",BriteBrassPlate:"static/IR/H3000/372_BriteBrassPlate.wav",CLOSE_MIKED:"static/IR/H3000/377_CLOSE_MIKED.wav",COMB_SPACE_1:"static/IR/H3000/378_COMB_SPACE_1.wav",COMPRESSED_AIR:"static/IR/H3000/379_COMPRESSED_AIR.wav",DOUBLE_SPACE_DENSE_ROOM:"static/IR/H3000/381_DOUBLE_SPACE_DENSE_ROOM.wav",DENSE_HALL_2:"static/IR/H3000/382_DENSE_HALL_2.wav",DELAY_W__ROOM:"static/IR/H3000/383_DELAY_W__ROOM.wav",DRAGON_BREATH:"static/IR/H3000/385_DRAGON_BREATH.wav",DRUM_AMBIENCE:"static/IR/H3000/387_DRUM_AMBIENCE.wav",GATED_FENCE:"static/IR/H3000/390_GATED_FENCE.wav",GATED_ROOM_2:"static/IR/H3000/391_GATED_ROOM_2.wav",GENERIC_HALL:"static/IR/H3000/392_GENERIC_HALL.wav",GREAT_DRUMSPACE:"static/IR/H3000/393_GREAT_DRUMSPACE.wav","5SEC_HANG_VERB":"static/IR/H3000/394_5SEC_HANG_VERB.wav",HUGE_DENSE_HALL:"static/IR/H3000/395_HUGE_DENSE_HALL.wav",HUGE_SYNTHSPACE:"static/IR/H3000/396_HUGE_SYNTHSPACE.wav",MANY_REFLECTIONS:"static/IR/H3000/516_MANY_REFLECTIONS.wav",AMBIENCE:"static/IR/H3000/555_AMBIENCE.wav",AMBIENT_BOOTH:"static/IR/H3000/556_AMBIENT_BOOTH.wav",BATHROOM:"static/IR/H3000/557_BATHROOM.wav",CRASS_ROOM:"static/IR/H3000/559_CRASS_ROOM.wav","DREW'S_CHAMBER":"static/IR/H3000/561_DREW'S_CHAMBER.wav",DRUM_AMBIENCE:"static/IR/H3000/562_DRUM_AMBIENCE.wav",EMPTY_CLOSET:"static/IR/H3000/563_EMPTY_CLOSET.wav",EMPTY_ROOM:"static/IR/H3000/564_EMPTY_ROOM.wav",MEDIUM_SPACE:"static/IR/H3000/565_MEDIUM_SPACE.wav",NEW_HOUSE:"static/IR/H3000/566_NEW_HOUSE.wav",PRCSVHORN_PLATE:"static/IR/H3000/567_PRCSVHORN_PLATE.wav",REAL_ROOM:"static/IR/H3000/568_REAL_ROOM.wav",SMALL_ROOM:"static/IR/H3000/569_SMALL_ROOM.wav",SMLSTEREOSPACE:"static/IR/H3000/570_SMLSTEREOSPACE.wav",SMALLVOCAL_ROOM:"static/IR/H3000/571_SMALLVOCAL_ROOM.wav",TIGHT_ROOM:"static/IR/H3000/572_TIGHT_ROOM.wav","TIGHT_&_BRIGHT":"static/IR/H3000/573_TIGHT_&_BRIGHT.wav",VOCAL_BOOTH:"static/IR/H3000/574_VOCAL_BOOTH.wav",ALIVE_CHAMBER:"static/IR/H3000/575_ALIVE_CHAMBER.wav",BIG_SWEEP:"static/IR/H3000/577_BIG_SWEEP.wav","BOB'S_ROOM":"static/IR/H3000/578_BOB'S_ROOM.wav",BREATHING_CANYON:"static/IR/H3000/579_BREATHING_CANYON.wav",BRIGHT_ROOM:"static/IR/H3000/580_BRIGHT_ROOM.wav",CANYON:"static/IR/H3000/581_CANYON.wav",CONCERT_HALL:"static/IR/H3000/582_CONCERT_HALL.wav",DARK_ROOM:"static/IR/H3000/583_DARK_ROOM.wav","DISCRETE-VERB":"static/IR/H3000/584_DISCRETE-VERB.wav",NORTHWEST_HALL:"static/IR/H3000/585_NORTHWEST_HALL.wav",RICH_PLATE:"static/IR/H3000/586_RICH_PLATE.wav",SLAPVERB:"static/IR/H3000/587_SLAPVERB.wav",SMOOTH_PLATE:"static/IR/H3000/588_SMOOTH_PLATE.wav",WARM_HALL:"static/IR/H3000/589_WARM_HALL.wav","ECHO-VERB":"static/IR/H3000/591_ECHO-VERB.wav","EXPLODING_'vERB":"static/IR/H3000/592_EXPLODING_'vERB.wav",GATED_REVERB:"static/IR/H3000/593_GATED_REVERB.wav",GATED_ROOM:"static/IR/H3000/594_GATED_ROOM.wav",GATE_ROOM:"static/IR/H3000/595_GATE_ROOM.wav","HUMP-VERB":"static/IR/H3000/596_HUMP-VERB.wav",METALVERB:"static/IR/H3000/597_METALVERB.wav",RANDOM_GATE:"static/IR/H3000/598_RANDOM_GATE.wav",REVERSE_GATE:"static/IR/H3000/600_REVERSE_GATE.wav",REVERB_RAMP:"static/IR/H3000/601_REVERB_RAMP.wav",SHIMMERISH:"static/IR/H3000/602_SHIMMERISH.wav",TONAL_ROOM:"static/IR/H3000/603_TONAL_ROOM.wav",DRUM_PROCESSOR:"static/IR/H3000/643_DRUM_PROCESSOR.wav",LIQUID_REVERB:"static/IR/H3000/646_LIQUID_REVERB.wav",REVERSERB:"static/IR/H3000/655_REVERSERB.wav",BOUNCE_VERB:"static/IR/H3000/712_BOUNCE_VERB.wav",DEATHLESS_ROOM:"static/IR/H3000/716_DEATHLESS_ROOM.wav",ENDLESS_CAVE:"static/IR/H3000/719_ENDLESS_CAVE.wav","REVERB-a-BOUND":"static/IR/H3000/736_REVERB-a-BOUND.wav",SMALL_DARK_ROOM:"static/IR/H3000/739_SMALL_DARK_ROOM.wav",CLONEVERB:"static/IR/H3000/793_CLONEVERB.wav","LONG_&_SMOOTH":"static/IR/H3000/795_LONG_&_SMOOTH.wav",MEAT_LOCKER:"static/IR/H3000/796_MEAT_LOCKER.wav",ethereal:"static/IR/H3000/833_ethereal.wav",rewzNooRoom:"static/IR/H3000/86_DrewzNooRoom.wav",swell_reverb:"static/IR/H3000/884_swell_reverb.wav",PAPER_PLATE:"static/IR/H3000/980_PAPER_PLATE.wav",USEFUL_VERB_2:"static/IR/H3000/985_USEFUL_VERB_2.wav",ROBO_DRUM:"static/IR/H3000/990_ROBO_DRUM.wav",AIR_SHAMIR:"static/IR/H3000/991_AIR_SHAMIR.wav","SMALL_&_LIVE_VERB":"static/IR/H3000/995_SMALL_&_LIVE_VERB.wav"},t={}}).call(this);