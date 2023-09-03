import { DOM } from "./constants";
import { setupAudio, toggleVolume } from "./noise";
import { 
  AUDIO,
  setAction,
  toggleAudio
} from "./state";

const handleAudio = async () => {
  const soundButton = document.getElementById(DOM.SOUND_BUTTON_ID);
  const on = soundButton?.querySelector("div[data-attr='on']");
  const off = soundButton?.querySelector("div[data-attr='off']");
  if (!AUDIO) {
    off?.classList.add("hidden")
    on?.classList.remove("hidden")
    setupAudio();
  } else {
    on?.classList.add("hidden")
    off?.classList.remove("hidden")
    
    // TODO: MUTE AUDIO 
  }
  toggleVolume();
  toggleAudio();
}

document.querySelectorAll(DOM.MENU_ITEMS).forEach((item) => {
  item.addEventListener("click", (e) => {
    const type = item.getAttribute("data-type");
    if (type?.startsWith("tree:")) {
      setAction(type.replace("tree:", ""));
    } else {
      setAction(type);
    }
  });
});

//attach a click listener to a play button
document.getElementById(DOM.SOUND_BUTTON_ID)?.addEventListener(
  'click',
  handleAudio
);

document.getElementById(DOM.MODAL_SOUND_BUTTON_ID)?.addEventListener(
  'click',
  handleAudio
);

