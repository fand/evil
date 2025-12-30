/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import { FX } from './FX';
import { ReverbView } from './ReverbView';

const IR_LOADED: Record<string, AudioBuffer> = {};

export type ReverbParams = {
  name: string;
  wet: number;
};

export class Reverb extends FX {
  reverb: ConvolverNode;
  name: string = 'BIG_SNARE';

  override view: ReverbView;

  constructor(ctx: AudioContext) {
    super(ctx);
    this.reverb = this.ctx.createConvolver();
    this.in.connect(this.reverb);
    this.reverb.connect(this.wet);
    this.wet.connect(this.out);
    this.in.connect(this.out);

    this.setIR(this.name);

    this.view = new ReverbView(this);
  }

  setIR(name: string) {
    this.name = name;

    if (IR_LOADED[this.name] != null) {
      this.reverb.buffer = IR_LOADED[this.name];
      return;
    }

    const url = IR_URL[this.name];
    if (url == null) {
      return;
    }

    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = () => {
      return this.ctx.decodeAudioData(
        req.response,
        (buffer) => {
          this.reverb.buffer = buffer;
          return (IR_LOADED[this.name] = buffer);
        },
        (err) => {
          console.log('ajax error');
          return console.log(err);
        }
      );
    };
    return req.send();
  }

  setParam(p: Partial<ReverbParams>) {
    if (p.name != null) {
      this.setIR(p.name);
    }
    if (p.wet != null) {
      this.setWet(p.wet);
    }
    return this.view.setParam(p);
  }

  getParam() {
    return {
      effect: 'Reverb',
      name: this.name,
      wet: this.wet.gain.value,
    };
  }
}

const IR_URL: Record<string, string> = {
  BIG_SNARE: 'static/IR/H3000/206_BIG_SNARE.wav',
  Sweep_Reverb: 'static/IR/H3000/106_Sweep_Reverb.wav',
  Reverb_Factory: 'static/IR/H3000/107_Reverb_Factory.wav',
  Dense_Room: 'static/IR/H3000/114_Dense_Room.wav',
  '8_SEC_REVERB': 'static/IR/H3000/154_8_SEC_REVERB.wav',
  GUITAR_ROOM: 'static/IR/H3000/178_GUITAR_ROOM.wav',
  HUNTER_DELAY: 'static/IR/H3000/181_HUNTER_DELAY.wav',
  JERRY_RACE_CAR: 'static/IR/H3000/182_JERRY_RACE_CAR.wav',
  ResoVibroEee: 'static/IR/H3000/192_ResoVibroEee.wav',
  ROOM_OF_DOOM: 'static/IR/H3000/193_ROOM_OF_DOOM.wav',
  'RHYTHM_&_REVERB': 'static/IR/H3000/194_RHYTHM_&_REVERB.wav',
  BIG_SNARE_206: 'static/IR/H3000/206_BIG_SNARE.wav',
  BIG_SWEEP_207: 'static/IR/H3000/207_BIG_SWEEP.wav',
  BRIGHT_ROOM_209: 'static/IR/H3000/209_BRIGHT_ROOM.wav',
  CANYON_211: 'static/IR/H3000/211_CANYON.wav',
  DARK_ROOM_213: 'static/IR/H3000/213_DARK_ROOM.wav',
  'DISCRETE-VERB_215': 'static/IR/H3000/215_DISCRETE-VERB.wav',
  "EXPLODING_'VERB": "static/IR/H3000/219_EXPLODING_'VERB.wav",
  GATED_REVERB_223: 'static/IR/H3000/223_GATED_REVERB.wav',
  LOCKER_ROOM: 'static/IR/H3000/230_LOCKER_ROOM.wav',
  RANDOM_GATE_240: 'static/IR/H3000/240_RANDOM_GATE.wav',
  REVERSE_GATE_241: 'static/IR/H3000/241_REVERSE_GATE.wav',
  RICH_PLATE_243: 'static/IR/H3000/243_RICH_PLATE.wav',
  SHIMMERISH_246: 'static/IR/H3000/246_SHIMMERISH.wav',
  SMALL_ROOM_248: 'static/IR/H3000/248_SMALL_ROOM.wav',
  TONAL_ROOM_254: 'static/IR/H3000/254_TONAL_ROOM.wav',
  WARM_HALL_257: 'static/IR/H3000/257_WARM_HALL.wav',
  'THRAX-VERB': 'static/IR/H3000/261_THRAX-VERB.wav',
  TWIRLING_ROOM: 'static/IR/H3000/262_TWIRLING_ROOM.wav',
  USEFUL_VERB: 'static/IR/H3000/265_USEFUL_VERB.wav',
  FLUTTEROUS_ROOM: 'static/IR/H3000/278_FLUTTEROUS_ROOM.wav',
  MARKS_MED_DARK: 'static/IR/H3000/282_MARKS_MED_DARK.wav',
  LG_GUITAR_ROOM: 'static/IR/H3000/283_LG_GUITAR_ROOM.wav',
  ACCURATE_ROOM: 'static/IR/H3000/368_ACCURATE_ROOM.wav',
  BASS_SPACE: 'static/IR/H3000/371_BASS_SPACE.wav',
  BriteBrassPlate: 'static/IR/H3000/372_BriteBrassPlate.wav',
  CLOSE_MIKED: 'static/IR/H3000/377_CLOSE_MIKED.wav',
  COMB_SPACE_1: 'static/IR/H3000/378_COMB_SPACE_1.wav',
  COMPRESSED_AIR: 'static/IR/H3000/379_COMPRESSED_AIR.wav',
  DOUBLE_SPACE_DENSE_ROOM: 'static/IR/H3000/381_DOUBLE_SPACE_DENSE_ROOM.wav',
  DENSE_HALL_2: 'static/IR/H3000/382_DENSE_HALL_2.wav',
  DELAY_W__ROOM: 'static/IR/H3000/383_DELAY_W__ROOM.wav',
  DRAGON_BREATH: 'static/IR/H3000/385_DRAGON_BREATH.wav',
  DRUM_AMBIENCE: 'static/IR/H3000/387_DRUM_AMBIENCE.wav',
  GATED_FENCE: 'static/IR/H3000/390_GATED_FENCE.wav',
  GATED_ROOM_2: 'static/IR/H3000/391_GATED_ROOM_2.wav',
  GENERIC_HALL: 'static/IR/H3000/392_GENERIC_HALL.wav',
  GREAT_DRUMSPACE: 'static/IR/H3000/393_GREAT_DRUMSPACE.wav',
  '5SEC_HANG_VERB': 'static/IR/H3000/394_5SEC_HANG_VERB.wav',
  HUGE_DENSE_HALL: 'static/IR/H3000/395_HUGE_DENSE_HALL.wav',
  HUGE_SYNTHSPACE: 'static/IR/H3000/396_HUGE_SYNTHSPACE.wav',
  MANY_REFLECTIONS: 'static/IR/H3000/516_MANY_REFLECTIONS.wav',
  AMBIENCE: 'static/IR/H3000/555_AMBIENCE.wav',
  AMBIENT_BOOTH: 'static/IR/H3000/556_AMBIENT_BOOTH.wav',
  BATHROOM: 'static/IR/H3000/557_BATHROOM.wav',
  CRASS_ROOM: 'static/IR/H3000/559_CRASS_ROOM.wav',
  "DREW'S_CHAMBER": "static/IR/H3000/561_DREW'S_CHAMBER.wav",
  DRUM_AMBIENCE_562: 'static/IR/H3000/562_DRUM_AMBIENCE.wav',
  EMPTY_CLOSET: 'static/IR/H3000/563_EMPTY_CLOSET.wav',
  EMPTY_ROOM: 'static/IR/H3000/564_EMPTY_ROOM.wav',
  MEDIUM_SPACE: 'static/IR/H3000/565_MEDIUM_SPACE.wav',
  NEW_HOUSE: 'static/IR/H3000/566_NEW_HOUSE.wav',
  PRCSVHORN_PLATE: 'static/IR/H3000/567_PRCSVHORN_PLATE.wav',
  REAL_ROOM: 'static/IR/H3000/568_REAL_ROOM.wav',
  SMALL_ROOM_569: 'static/IR/H3000/569_SMALL_ROOM.wav',
  SMLSTEREOSPACE: 'static/IR/H3000/570_SMLSTEREOSPACE.wav',
  SMALLVOCAL_ROOM: 'static/IR/H3000/571_SMALLVOCAL_ROOM.wav',
  TIGHT_ROOM: 'static/IR/H3000/572_TIGHT_ROOM.wav',
  'TIGHT_&_BRIGHT': 'static/IR/H3000/573_TIGHT_&_BRIGHT.wav',
  VOCAL_BOOTH: 'static/IR/H3000/574_VOCAL_BOOTH.wav',
  ALIVE_CHAMBER: 'static/IR/H3000/575_ALIVE_CHAMBER.wav',
  BIG_SWEEP_577: 'static/IR/H3000/577_BIG_SWEEP.wav',
  "BOB'S_ROOM": "static/IR/H3000/578_BOB'S_ROOM.wav",
  BREATHING_CANYON: 'static/IR/H3000/579_BREATHING_CANYON.wav',
  BRIGHT_ROOM_580: 'static/IR/H3000/580_BRIGHT_ROOM.wav',
  CANYON_581: 'static/IR/H3000/581_CANYON.wav',
  CONCERT_HALL: 'static/IR/H3000/582_CONCERT_HALL.wav',
  DARK_ROOM_583: 'static/IR/H3000/583_DARK_ROOM.wav',
  'DISCRETE-VERB_584': 'static/IR/H3000/584_DISCRETE-VERB.wav',
  NORTHWEST_HALL: 'static/IR/H3000/585_NORTHWEST_HALL.wav',
  RICH_PLATE_586: 'static/IR/H3000/586_RICH_PLATE.wav',
  SLAPVERB: 'static/IR/H3000/587_SLAPVERB.wav',
  SMOOTH_PLATE: 'static/IR/H3000/588_SMOOTH_PLATE.wav',
  WARM_HALL_589: 'static/IR/H3000/589_WARM_HALL.wav',
  'ECHO-VERB': 'static/IR/H3000/591_ECHO-VERB.wav',
  "EXPLODING_'vERB": "static/IR/H3000/592_EXPLODING_'vERB.wav",
  GATED_REVERB_593: 'static/IR/H3000/593_GATED_REVERB.wav',
  GATED_ROOM: 'static/IR/H3000/594_GATED_ROOM.wav',
  GATE_ROOM: 'static/IR/H3000/595_GATE_ROOM.wav',
  'HUMP-VERB': 'static/IR/H3000/596_HUMP-VERB.wav',
  METALVERB: 'static/IR/H3000/597_METALVERB.wav',
  RANDOM_GATE_598: 'static/IR/H3000/598_RANDOM_GATE.wav',
  REVERSE_GATE_600: 'static/IR/H3000/600_REVERSE_GATE.wav',
  REVERB_RAMP: 'static/IR/H3000/601_REVERB_RAMP.wav',
  SHIMMERISH_602: 'static/IR/H3000/602_SHIMMERISH.wav',
  TONAL_ROOM_603: 'static/IR/H3000/603_TONAL_ROOM.wav',
  DRUM_PROCESSOR: 'static/IR/H3000/643_DRUM_PROCESSOR.wav',
  LIQUID_REVERB: 'static/IR/H3000/646_LIQUID_REVERB.wav',
  REVERSERB: 'static/IR/H3000/655_REVERSERB.wav',
  BOUNCE_VERB: 'static/IR/H3000/712_BOUNCE_VERB.wav',
  DEATHLESS_ROOM: 'static/IR/H3000/716_DEATHLESS_ROOM.wav',
  ENDLESS_CAVE: 'static/IR/H3000/719_ENDLESS_CAVE.wav',
  'REVERB-a-BOUND': 'static/IR/H3000/736_REVERB-a-BOUND.wav',
  SMALL_DARK_ROOM: 'static/IR/H3000/739_SMALL_DARK_ROOM.wav',
  CLONEVERB: 'static/IR/H3000/793_CLONEVERB.wav',
  'LONG_&_SMOOTH': 'static/IR/H3000/795_LONG_&_SMOOTH.wav',
  MEAT_LOCKER: 'static/IR/H3000/796_MEAT_LOCKER.wav',
  ethereal: 'static/IR/H3000/833_ethereal.wav',
  rewzNooRoom: 'static/IR/H3000/86_DrewzNooRoom.wav',
  swell_reverb: 'static/IR/H3000/884_swell_reverb.wav',
  PAPER_PLATE: 'static/IR/H3000/980_PAPER_PLATE.wav',
  USEFUL_VERB_2: 'static/IR/H3000/985_USEFUL_VERB_2.wav',
  ROBO_DRUM: 'static/IR/H3000/990_ROBO_DRUM.wav',
  AIR_SHAMIR: 'static/IR/H3000/991_AIR_SHAMIR.wav',
  'SMALL_&_LIVE_VERB': 'static/IR/H3000/995_SMALL_&_LIVE_VERB.wav',
};
