var SEMITONE = 1.05946309;
var KEY_LIST = {
    A:  55,
    Bb: 58.27047018976124,
    B:  61.7354126570155,
    C:  32.70319566257483,
    Db: 34.64782887210901,
    D:  36.70809598967594,
    Eb: 38.890872965260115,
    E:  41.20344461410875,
    F:  43.653528929125486,
    Gb: 46.2493028389543,
    G:  48.999429497718666,
    Ab: 51.91308719749314
};
var SCALE_LIST = {
    IONIAN:     [0,2,4,5,7,9,11,12,14,16],
    DORIAN:     [0,2,3,5,7,9,10,12,14,15],
    PHRYGIAN:   [0,1,3,5,7,8,10,12,13,15],
    LYDIAN:     [0,2,4,6,7,9,11,12,14,16],
    MIXOLYDIAN: [0,2,4,5,7,9,10,12,14,16],
    AEOLIAN:    [0,2,3,5,7,8,10,12,14,15],
    LOCRIAN:    [0,1,3,5,6,8,10,12,13,15]
};
var STREAM_LENGTH = 1024;
var SAMPLE_RATE   = 44100;


var Player = function(){
    this.bpm = 120;
    this.duration = 500; // msec
    this.freq_key = 55;
    this.scale = [];
    this.setBPM();
    this.setScale();
    this.is_playing = false;
    this.position = 0;


    this.context = new webkitAudioContext();
    SAMPLE_RATE = this.context.sampleRate;
    this.synth = [];
    this.synth.push(new Synth(this.context, 42));

    this.pattern = [8,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];    

    for (var i=0; i<this.synth.length; i++) {
        this.synth[i].connect(this.context.destination);
    }
};
Player.prototype.setBPM = function(){
    this.bpm = $("#control [name=bpm]").val();
    this.duration = 15.0 / this.bpm* 1000; // msec
};
Player.prototype.setKey = function(){
    this.freq_key = KEY_LIST[$("#key").val()];
    for (var i=0; i < this.synth.length; i++) {
        this.synth[i].setKey(this.freq_key);
    }
};
Player.prototype.setScale = function(){
    this.scale = SCALE_LIST[$("#control [name=mode]").val()];
};
Player.prototype.addPattern = function(time, note){
    this.pattern[time] = note;
 
};
Player.prototype.removePattern = function(time){
    this.pattern[time] = 0;
};
Player.prototype.isPlaying = function(){
    return this.is_playing;
};
Player.prototype.play = function(pos){
    this.is_playing = true;
    if(pos!=undefined){
        this.position = pos;
    }
    var self = this;
    $("#indicator").show();
    setTimeout(function(){self.play_seq();},100);
};
Player.prototype.play_seq = function(){
    if(this.is_playing){
        if(this.position >= this.pattern.length){
            this.position = 0;
        }
        if(this.pattern[this.position] != 0){
            this.noteOn(this.pattern[this.position]);
        }
        var self = this;
        setTimeout(function(){
            self.noteOff();
        }, self.duration-10);
        setTimeout(function(){self.position++;self.play_seq();}, self.duration);
        
        $("#indicator").css("left", (26*this.position + 70)+"px");
    }
};
Player.prototype.stop = function(){
    this.is_playing = false;
    this.position = this.pattern.length;
    $("#indicator").hide().css("left", "-1000px");
};
Player.prototype.pause = function(){
    this.is_playing = false;
};
Player.prototype.noteOn = function(note){
    for(var i=0; i<this.synth.length; i++){
        this.synth[i].setNote(this.intervalToSemitone(note));
        this.synth[i].noteOn();
    }
};
Player.prototype.noteOff = function(){
    for(var i=0; i<this.synth.length; i++){
        this.synth[i].noteOff();
    }
};
Player.prototype.intervalToSemitone  = function(ival){
    return Math.floor((ival-1)/7) * 12 + this.scale[(ival-1) % 7];
};
Player.prototype.readPattern = function(pat){
    $(".on").removeClass("on").addClass("off");
    for(var i=0; i<pat.length; i++){
        if(pat[i]!=0){
            $("[note=" + pat[i] + "] *").filter(function(){
                return ($(this).text() == i);
            }).removeClass("off").addClass("on");
        }
    }

    this.pattern = pat;
};
Player.prototype.getPattern = function(){
    return this.pattern;
};




$(function(){
    $("#twitter").socialbutton('twitter', {
        button: 'horizontal',
        text:   'Web Audio API Sequencer http://www.kde.cs.tsukuba.ac.jp/~fand/wasynth/'
    });
    $("#hatena").socialbutton('hatena');
    $("#facebook").socialbutton('facebook_like', {
        button: 'button_count'
    });
    
    var player = new Player();
    var note = 0;
    var time = 0;

    var pressed_key = false;
    var pressed_mouse = false;

    player.setBPM();
    player.setKey();
    player.setScale();

    
    $("td").each(function(){
        $(this).addClass("off");
    });
  
    $("tr").bind("mouseenter", function(event){
        note = $(this).attr("note");
    });
    
    $("td").mousedown(function(){
        pressed_mouse = true;
        time = $(this).text();
        
        if ($(this).hasClass("on")) {
            $(this).removeClass().addClass("off");
            player.removePattern(time);
        }
        else {
            // 同じ列でクリックされた以外のセルをonクラスをremove
            $(".on").filter(function(i){
                return ($(this).text() == time);
            }).each(function(){
                $(this).removeClass().addClass("off");
            });
            $(this).removeClass().addClass("on");
            player.addPattern(time, note);
        }
    }).mouseenter(function(){
        if(pressed_mouse){
            time = $(this).text();

            // 同じ列でクリックされた以外のセルをonクラスをremove
            $(".on").filter(function(i){
                return ($(this).text() == time);
            }).each(function(){
                $(this).removeClass().addClass("off");
            });
            $(this).removeClass().addClass("on");
            player.addPattern(time, note);
        }
    }).mouseup(function(){
        pressed_mouse = false;
    });
    
    $("#play").bind("mousedown", function(){
        if (player.isPlaying()) {
            player.pause();
            $(this).attr("value", "play");
        }
        else {
            player.play();
            $(this).attr("value", "pause");
        }
    });

    $("#stop").bind("mousedown", function(){
        player.stop();
        $("#play").attr("value", "play");
    });

    

    $("th").bind("mousedown", function(){
        player.noteOn(note);
    });
    $("th").bind("mouseup", function(){
        player.noteOff();
    });

    $("#control").bind("change", function(){
        player.setBPM();
        player.setKey();
        player.setScale();
    });



    $(window).keydown(function(e){
        if(pressed_key==false){
            pressed_key=true;
            
            if(player.isPlaying()){
                player.noteOff();
            }
            
            switch(e.keyCode){
            case 90:
                player.noteOn(1); break;
            case 88:
                player.noteOn(2); break;
            case 67:
                player.noteOn(3); break;
            case 86:
                player.noteOn(4); break;
            case 66:
                player.noteOn(5); break;
            case 78:
                player.noteOn(6); break;
            case 77:
                player.noteOn(7); break;
            case 188: case 65:
                player.noteOn(8); break;
            case 190: case 83:
                player.noteOn(9); break;
            case 191: case 68:
                player.noteOn(10); break;
            case 70:
                player.noteOn(11); break;
            case 71:
                player.noteOn(12); break;
            case 72:
                player.noteOn(13); break;
            case 74: 
                player.noteOn(14); break;
            case 75: case 81:
                player.noteOn(15); break;
            case 76: case 87:
                player.noteOn(16); break;
            case 187: case 69:
                player.noteOn(17); break;
            case 82:
                player.noteOn(18); break;
            case 84:
                player.noteOn(19); break;
            case 89:
                player.noteOn(20); break;
            case 85:
                player.noteOn(21); break;
            case 73: case 49:
                player.noteOn(22); break;
            case 79: case 50:
                player.noteOn(23); break;
            case 80: case 51:
                player.noteOn(24); break;
            case 52:
                player.noteOn(25); break;
            case 53:
                player.noteOn(26); break;
            case 54:
                player.noteOn(27); break;
            case 55:
                player.noteOn(28); break;
            case 56:
                player.noteOn(29); break;
            case 57:
                player.noteOn(30); break;
            case 48:
                player.noteOn(31); break;
            }
        }
    });
    
    $(window).keyup(function(){
        pressed_key = false;
        player.noteOff();
    });
    
    var pat = [3,3,10,3,10,3,9,3,3,3,10,3,10,3,9,3,1,1,10,1,10,1,9,1,2,2,10,2,10,2,9,2];
    player.readPattern(pat);
});

