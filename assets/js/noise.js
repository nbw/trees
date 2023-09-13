
import * as Tone from "../vendor/tone.js";

let SYNTH = null;
let AUDIO_ENABLED = false;
let COMPRESSOR = null;
let VOLUME = null;
/* 
Note: Oscillator types defined:
https://github.com/Tonejs/Tone.js/blob/c313bc672bcc09a8cee4df97a07ba80155fd1946/Tone/source/oscillator/OscillatorInterface.ts#L439
*/
let INSTRUMENTS = [
  () => {
    const synth = new Tone.PolySynth({
      voice: Tone.Synth, 
      volume: -6,
      maxPolyphony: 64,
      options: {
        envelope: {
          attack: 0.2,
          decay: 0.25,
          sustain: 0.2,
          release: 5
        },
        oscillator: {
          type: "fatsine",
          // type: "amtriangle",
          // type: "amsine",
          partials: [0, 4],
        }
      },
    })

    const reverb = new Tone.Reverb({decay: 1.5, wet: 0.75});
    const delay = new Tone.PingPongDelay("5n", 0.35);
    const delayReverb = new Tone.Reverb({decay: 1.5, wet: 0.95});
    const delayGain = new Tone.Gain(0.5);

    // Clean Channel
    synth.connect(reverb);

    // Delay Channel
    synth.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(delayReverb);
    delayReverb.connect(COMPRESSOR);

    reverb.connect(COMPRESSOR);

    return synth;
  },
  () => {
    const synth = new Tone.PolySynth({
      voice: Tone.Synth, 
      volume: 0,
      maxPolyphony: 64,
      options: {
        envelope: {
          attack: 0.85,
          decay: 0.25,
          sustain: 0.2,
          release: 3.5
        },
        oscillator: {
          type: "amsine",
          // type: "amtriangle",
        }
      },
    })

    const reverb = new Tone.Reverb({decay: 1.5, wet: 0.75});
    const delay = new Tone.PingPongDelay("3n", 0.15);
    const delayReverb = new Tone.Reverb({decay: 1.5, wet: 0.95});
    const delayGain = new Tone.Gain(0.3);

    // Clean Channel
    synth.connect(reverb);

    // Delay Channel
    synth.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(delayReverb);
    delayReverb.connect(COMPRESSOR);

    reverb.connect(COMPRESSOR);

    return synth;
  },
  () => {
    const synth = new Tone.PolySynth({
      voice: Tone.Synth, 
      volume: -6,
      maxPolyphony: 64,
      options: {
        envelope: {
          attack: 1.2,
          decay: 3,
          release: 5
        },
        oscillator: {
          type: "fmtriangle",
          // type: "amtriangle",
          // type: "amsine",
        }
      },
    })

    const reverb = new Tone.Reverb({decay: 1.5, wet: 0.5});
    const delay = new Tone.PingPongDelay("5n", 0.25);
    const delayReverb = new Tone.Reverb({decay: 1.5, wet: 0.75});
    const delayGain = new Tone.Gain(0.3);

    // Clean Channel
    synth.connect(reverb);

    // Delay Channel
    synth.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(delayReverb);

    delayReverb.connect(COMPRESSOR);
    reverb.connect(COMPRESSOR);

    return synth;
  }

]


export const setupAudio = function() {
  Tone.context.resume().then(() => {
    COMPRESSOR = new Tone.Compressor(-30, 3);
    VOLUME = new Tone.Volume(0);
    for (let i = 0; i < INSTRUMENTS.length; i++) {
      INSTRUMENTS[i] = INSTRUMENTS[i]();
    }

    COMPRESSOR.connect(VOLUME);
    VOLUME.toDestination();
    AUDIO_ENABLED = true;
  });
}

export const makeNoise = (instrument, notes, velocity = 0.8) => {
  if (AUDIO_ENABLED) {
    const note = notes[Math.floor(Math.random() * notes.length)];
    INSTRUMENTS[instrument].triggerAttackRelease(note, "8n",  Tone.now(), velocity);
  }
}

export const toggleVolume = () => {
  if (VOLUME == null) {
    return;
  }
  VOLUME.mute = !VOLUME.mute;
}