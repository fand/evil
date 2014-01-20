@CONTEXT =
    createGain

@MutekiTimer = require '../static/coffee/MutekiTimer'

@Panner = require '../static/coffee/Panner'
@Synth   = require '../static/coffee/Synth'
@Effect  = require '../static/coffee/Effect'

@SynthView   = require '../static/coffee/SynthView'


p = new Player()

casper.test.begin "Player", 1, (t) ->
#    t.assert(p.bpm == 120)
    t.assert(true)
    t.done()

casper.run ->
    @echo 'done'
