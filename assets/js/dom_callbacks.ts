import { DOM } from "./constants";
import { setupAudio } from "./noise";
import { setAction } from "./state";

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
  async () => { setupAudio(); }
);