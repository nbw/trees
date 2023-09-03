/**
 * Phoenix Channel (websocket) callbacks
 *
 * AKA: handle events sent from the backend
 */

import {
  CHANNEL,
  MAIN_LAYER,
  STAGE
} from "./state";
import {
  CH
} from "./constants";
import { channelCallback } from "./core/socket";
import { createTree, destroyTree } from "./playground";

export const setup = () => {
  channelCallback(CHANNEL, CH.TREE_NEW, (tree) => {
    createTree(tree);

    STAGE.find('#temp').forEach((t) => {
      t.destroy()
    });
  });
  channelCallback(CHANNEL, CH.TREE_DESTROY, (tree) => {
    destroyTree(tree);
  });
};