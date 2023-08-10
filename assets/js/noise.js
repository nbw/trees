
import * as Tone from "../vendor/tone.js";

let SYNTH = null;
let AUDIO_ENABLED = false;

export const setupAudio = function() {
  Tone.context.resume().then(() => {
    SYNTH = new Tone.Synth({
      volume: -6,
      envelope: {
        attack: 2,
        decay: 1.5,
        sustain: 1,
        release: 8
      }
    }
    )
    const reverb = new Tone.Reverb(0.7);
    const delay = new Tone.PingPongDelay("3n", 0.4);
    const split = new Tone.Split();
    const delayGain = new Tone.Gain(0.5);
    const merge = new Tone.Merge();
    const compressor = new Tone.Compressor(-30, 3);
    SYNTH.connect(split);
    split.connect(merge);
    split.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(merge);
    merge.connect(reverb);
    merge.connect(compressor);

    compressor.toDestination();
    AUDIO_ENABLED = true;
  });
}

export const makeNoise = (velocity = 0.9) => {
  if (AUDIO_ENABLED) {
    var notes = ["C4","D4", "E4", "B4", "G4", "A4", "C5","D5", "E5", "B5", "G5", "A3", "B3", "G2", "C4", "D2", "E2", "B3", "G2", "A2", "C2", "G1", "B2"]
    var note = notes[Math.floor(Math.random() * notes.length)];
    SYNTH.triggerAttackRelease(note, "8n",  Tone.now(), velocity);
  }
}