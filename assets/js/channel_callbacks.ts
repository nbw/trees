/**
 * Phoenix Channel (websocket) callbacks
 *
 * AKA: handle events sent from the backend
 */

import {
  CHANNEL,
  STAGE
} from "./state";
import {
  CH
} from "./constants";
import { channelCallback } from "./core/socket";
import { createTree } from "./playground";

export const setup = () => {
  channelCallback(CHANNEL, CH.TREE_NEW, (tree) => {
    createTree(tree);

    // find the tree that was created temporarily and destroy it
    STAGE.find('#temp').forEach((t) => t.destroy());
  });
};