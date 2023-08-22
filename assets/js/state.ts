import { setupChannel,
setupChannelFromSocket } from "./core/socket";
import Konva from "../vendor/konva.min.js";
import { DOM } from "./constants";

export let POSITION = { x: 0, y: 0 };
export let CANVAS = document.getElementById(DOM.CANVAS_ID);
export let CHANNEL = null;
export let MAIN_LAYER = new Konva.Layer();
export let SECONDARY_LAYER = new Konva.Layer();
export let BACKGROUND_LAYER = new Konva.Layer();
export let FOREGROUND_LAYER = new Konva.Layer();
export let ACTION = "oak";
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

export const setupFromSocket = (socket, channelName) => {
  CHANNEL = setupChannelFromSocket(socket, channelName);
};

export const setAction = (action : string) => {
  ACTION = action;
}
