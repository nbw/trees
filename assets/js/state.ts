import { setupChannel } from "./core/socket";
import Konva from "../vendor/konva.min.js";
import { DOM } from "./constants";

export let POSITION = { x: 0, y: 0 };
export let CANVAS = document.getElementById(DOM.CANVAS_ID);
export let CHANNEL = null;
export let LAYER = new Konva.Layer();
export let SELECTED_TREE = "oak";
export let STAGE = new Konva.Stage({
    container: DOM.CANVAS_ID,
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
});
export let TREES = {};

export const setup = (csrfToken, channelName) => {
  CHANNEL = setupChannel(csrfToken, channelName);
};

export const setSelectedTree = (type : string) => {
  SELECTED_TREE = type;
}
