const SEMITONE = 1.05946309;
const STREAM_LENGTH = 1024;
const SAMPLE_RATE = 48000;


var VCO = function(){
    this.freq_key = 55;
    this.shape = "SINE";
    this.octave = 4;
    this.interval = 0;
    this.fine = 0;
    this.note = 0;
    this.freq = Math.pow(2, this.octave) * this.freq_key;

    // 44100 / freq = 1周期当りのサンプル数
    this.period_sample = SAMPLE_RATE / this.freq;
    this.phase = 0;
    this.d_phase = (2.0 * Math.PI) / this.period_sample;
};
VCO.prototype.setShape = function(shape){
    this.shape = shape;
};
VCO.prototype.setOctave = function(oct){
    this.octave = oct;
};
VCO.prototype.setInterval = function(ival){
    this.interval = ival;
};
VCO.prototype.setFine = function(fine){
    this.fine = fine;
};
VCO.prototype.setNote = function(note){
    this.note = note;
};
VCO.prototype.setFreq = function(){
    this.freq =
        Math.pow(2, this.octave)
        * Math.pow(SEMITONE, this.interval + this.note)
        * this.freq_key
        + this.fine;
    this.period_sample = SAMPLE_RATE / this.freq;
    this.d_phase = (2.0 * Math.PI) / this.period_sample;
};
VCO.prototype.setKey = function(k){
    this.freq_key = k;
};
VCO.prototype.sine = function(){
    return Math.sin(this.phase * this.d_phase);
};
VCO.prototype.triangle = function(){
    var saw2 = this.saw() * 2.0;
    if (saw2 < -1.0) {
        return saw2 + 2.0;
    }
    if (saw2 < 1.0) {
        return -(saw2);
    }
    else {
        return saw2 - 2.0;
    }
};
VCO.prototype.saw = function(){
    var p = this.phase % this.period_sample;
    return 1.99 * (p / this.period_sample) - 1.0;
};
VCO.prototype.rect = function(){
    return (this.sine() > 0) ? -1.0 : 1.0;
};
VCO.prototype.noise = function(){
    return Math.random();
};
VCO.prototype.nextSample = function(){
    this.phase++;
    switch (this.shape) {
    case "SINE":     return this.sine();
    case "TRIANGLE": return this.triangle();
    case "SAW":      return this.saw();
    case "RECT":     return this.rect();
    case "NOISE":    return this.noise();
    default:         return this.sine();
    }
};
VCO.prototype.nextStream = function(){
    var stream = [];
    for (var i=0; i < STREAM_LENGTH; i++) {
        stream[i] = this.nextSample();
    }
    return stream;
};



var EG = function(){
    this.time = 0;
    this.on = false;
    this.envelope = 0.0;

    this.attack = 0;
    this.decay = 0;
    this.sustain = 0.0;
    this.release = 0;
};
EG.prototype.setParam = function(a, d, s, r){
    this.attack  = a;
    this.decay   = d;
    this.sustain = s / 100.0;
    this.release = r;
};
EG.prototype.getParam = function(){
    return [this.attack, this.decay, this.sustain, this.release];
};
EG.prototype.noteOn = function(){
    this.time = 0;
    this.on = true;
};
EG.prototype.noteOff = function(){
    this.time = 0;
    this.on = false;
    this.envelope_released = this.envelope;
};
EG.prototype.step = function(){
    this.time++;
};
EG.prototype.getEnvelope = function(){    
    if (this.on) {
        if (this.time < this.attack) {
            this.envelope = 1.0 * (this.time / this.attack);
        }
        else if (this.time < (this.attack + this.decay)) {
            var e = ((this.time - this.attack) / this.decay) * (1.0-this.sustain);
            this.envelope = 1.0 - e;
        }
        else {
            this.envelope = this.sustain;
        }
    }
    else {
        if (this.time < this.release) {
            this.envelope = this.envelope_released * (this.release-this.time) / this.release;
        }
        else {
            this.envelope = 0.0;
        }
    }    
    return this.envelope;
};



var ResFilter = function(ctx){
    this.lpf = ctx.createBiquadFilter();
    this.lpf.type = 0;    // lowpass == 0

    this.freq_min  = 80;
    this.freq      = 5000;
    this.resonance = 10;
    this.Q         = 10;
};
ResFilter.prototype.connect = function(dst){
    this.lpf.connect(dst);
};
ResFilter.prototype.connectFEG = function(g){
    this.feg = g;
};
ResFilter.prototype.getNode = function(){
    return this.lpf;
};
ResFilter.prototype.getResonance = function(){
    return this.Q;
};
ResFilter.prototype.setFreq = function(freq){
    this.freq = Math.pow(freq/1000, 2.0) * 25000;
};
ResFilter.prototype.setQ = function(q){
    this.Q = q;
    this.lpf.Q.value = this.Q;
};
ResFilter.prototype.update = function(){
    this.lpf.frequency.value = this.freq * this.feg.getEnvelope() + this.freq_min;
};



var Synth = function(ctx, id){
    this.id = id;
    
    this.node = ctx.createJavaScriptNode(STREAM_LENGTH, 1, 2);
    this.vco  = [new VCO(), new VCO(), new VCO()];
    this.gain = [1.0, 1.0, 1.0];
    
    this.eg  = new EG();
    this.feg = new EG();
    
    this.filter = new ResFilter(ctx);
    this.filter.connectFEG(this.feg);

    // resonance用ノイズ生成
    this.vco_res = new VCO();
    this.vco_res.setShape("NOISE");

    this.ratio      = 1.0;
    this.freq_key   = 0;
    this.is_playing = false;

    this.view = new SynthView(this, id);
};
Synth.prototype.setVCOParam = function(i, shape, oct, interval, fine){
    this.vco[i].setShape(shape);
    this.vco[i].setOctave(oct);
    this.vco[i].setInterval(interval);
    this.vco[i].setFine(fine);
    this.vco[i].setFreq();
};
Synth.prototype.setEGParam = function(a, d, s, r){
    this.eg.setParam(a, d, s, r);
};
Synth.prototype.setFEGParam = function(a, d, s, r){
    this.feg.setParam(a, d, s, r);
};
Synth.prototype.setFilterParam = function(freq, q){
    this.filter.setFreq(freq);
    this.filter.setQ(q);
};
Synth.prototype.setGain = function(i, gain){
    this.gain[i] = gain / 100.0;
};
Synth.prototype.nextStream = function(){
    var stream = [];
    var s_vco  = [];
    var s_res  = [];
    var res    = this.filter.getResonance();

    for (var j = 0; j < this.vco.length; j++) {
        s_vco[j] = this.vco[j].nextStream();
    }
    s_res = this.vco_res.nextStream();
    
    for (var i=0; i < STREAM_LENGTH; i++) {
        this.eg.step();
        this.feg.step();
        this.filter.update();
        
        var env = this.eg.getEnvelope();
        stream[i] = 0;
        for (j=0; j < this.vco.length; j++) {
            stream[i] += s_vco[j][i] * this.gain[j] *0.3 * env;
        }

        if (res > 1) {
            stream[i] += s_res[i] * 0.1 * (res/1000.0);
        }
    }
    return stream;
};
Synth.prototype.noteOn = function(){
    this.is_playing = true;

    this.eg.noteOn();
    this.feg.noteOn();

    var self = this;
    this.node.onaudioprocess = function(event) {
        var data_L = event.outputBuffer.getChannelData(0);
        var data_R = event.outputBuffer.getChannelData(1);
        var s = self.nextStream();
        var i = data_L.length;
        while (i--) {
            data_L[i] = s[i];
            data_R[i] = s[i];
        }
    };
};
Synth.prototype.noteOff = function(){
    this.is_playing = false;
    this.eg.noteOff();
    this.feg.noteOff();
    
    var self = this;
    this.node.onaudioprocess = function(event) {
        var data_L = event.outputBuffer.getChannelData(0);
        var data_R = event.outputBuffer.getChannelData(1);
        var s = self.nextStream();
        var i = data_L.length;
        while (i--) {
            data_L[i] = s[i];
            data_R[i] = s[i];
        }
    };
};
Synth.prototype.setKey = function(freq_key){
    this.freq_key = freq_key;
    for (var i=0; i < this.vco.length; i++) {
        this.vco[i].setKey(freq_key);
    }
};
Synth.prototype.setScale = function(scale){
    this.scale = scale;
};
Synth.prototype.isPlaying = function(){
    return this.is_playing;
};
Synth.prototype.connect = function(dst){
    this.node.connect(this.filter.getNode());
    this.filter.connect(dst);
};
Synth.prototype.setNote = function(note){
    for (var i=0; i < this.vco.length; i++) {
        this.vco[i].setNote(note);
        this.vco[i].setFreq();
    }
};



var SynthView = function(model, id){
    this.id = id;

    this.dom = $('#tmpl_synth');
    this.dom.attr('id', 'synth' + id);
    
    $("#instruments").append(this.dom);
    
    this.vcos = $(this.dom.find('.vco'));

    this.EG_inputs     = this.dom.find('.EG > input');
    this.FEG_inputs    = this.dom.find('.FEG > input');    
    this.filter_inputs = this.dom.find(".filter input");
    this.gain_inputs   = this.dom.find('.gain > input');    

    this.canvasEG   = this.dom.find(".canvasEG").get()[0];
    this.canvasFEG  = this.dom.find(".canvasFEG").get()[0];
    this.contextEG  = this.canvasEG.getContext('2d');
    this.contextFEG = this.canvasFEG.getContext('2d');
    
    this.model = model;
    this.initOn();
};
SynthView.prototype.initOn = function(){
    var self = this;
    
    this.setParam();
    this.vcos.on("change", function(){
        self.setVCOParam();
    });    
    this.gain_inputs.on("change", function(){
        self.setGain();
    });
    this.filter_inputs.on("change", function(){
        self.setFilterParam();
    });
    this.EG_inputs.on("change", function(){
        self.setEGParam();
    });
    this.FEG_inputs.on("change", function(){
        self.setFEGParam();
    });
    
    this.setParam();
};
SynthView.prototype.updateCanvas = function(name){
    var canvas, context, adsr;

    if (name == "EG") {
        canvas  = this.canvasEG;
        context = this.contextEG;
        adsr    = this.model.eg.getParam();
    }
    else {
        canvas  = this.canvasFEG;
        context = this.contextFEG;
        adsr    = this.model.feg.getParam();
    }

    var w = canvas.width = 180;
    var h = canvas.height = 50;    

    context.clearRect(0,0,w,h);

    context.beginPath();
    context.moveTo(w/4*(1.0- adsr[0]/50000.0), h);
    context.lineTo(w/4,0);  // attack
    context.lineTo(w/4 + (w/4)*(adsr[1]/50000.0),h*(1.0-adsr[2]));  // decay
    context.lineTo(w*3/4, h*(1.0-adsr[2]));  // sustain
    context.lineTo(w*3/4 + (w/4)*(adsr[3]/50000.0), h);  // release
    context.strokeStyle = 'rgb(0, 220, 255)';
    context.stroke();
};
SynthView.prototype.setParam = function(){
    this.setVCOParam();
    this.setEGParam();
    this.setFEGParam();
    this.setFilterParam();
    this.setGain();
};
SynthView.prototype.setVCOParam = function(){
    for (var i=0; i < this.vcos.length; i++) {
        var vco = this.vcos.eq(i);
        this.model.setVCOParam(
            i, 
            vco.find('.shape').val(),
            parseInt(vco.find('.octave').val()),
            parseInt(vco.find('.interval').val()),
            parseInt(vco.find('.fine').val())
        );        
    }
};
SynthView.prototype.setEGParam = function(){
    this.model.setEGParam(
        parseInt(this.EG_inputs.eq(0).val()),
        parseInt(this.EG_inputs.eq(1).val()),
        parseInt(this.EG_inputs.eq(2).val()),
        parseInt(this.EG_inputs.eq(3).val())
    );
    this.updateCanvas("EG");
};
SynthView.prototype.setFEGParam = function(){
    this.model.setFEGParam(
        parseInt(this.FEG_inputs.eq(0).val()),
        parseInt(this.FEG_inputs.eq(1).val()),
        parseInt(this.FEG_inputs.eq(2).val()),
        parseInt(this.FEG_inputs.eq(3).val())
    );
    this.updateCanvas("FEG");
};
SynthView.prototype.setFilterParam = function(){
    this.model.setFilterParam(
        parseInt(this.filter_inputs.eq(0).val()),
        parseInt(this.filter_inputs.eq(1).val())
    );
};
SynthView.prototype.setGain = function(){
    for (var i=0; i < this.gain_inputs.length; i++) {
        this.model.setGain(
            i,
            parseInt(this.gain_inputs.eq(i).val())
        );
    }
};
