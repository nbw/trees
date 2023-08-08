import Konva from "../vendor/konva.min.js";
import {
  CANVAS,
  CHANNEL,
  LAYER,
  POSITION,
  SELECTED_TREE,
  STAGE,
  TREES,
} from "./state.js";
import {
  CH
} from "./constants.js";
import { makeNoise } from "./noise.js";
import {Tree, build_tree_lookup} from "./tree.js";

build_tree_lookup();

export const go = () => {
  const X_BOUND = 5000;
  const Y_BOUND = 5000;

  const text = new Konva.Text({
        x: 10,
        y: 10,
        fontFamily: 'Calibri',
        fontSize: 24,
        text: '',
        fill: 'black',
  });

  const text2 = new Konva.Text({
        x: 10,
        y: 10,
        fontFamily: 'Calibri',
        fontSize: 24,
        text: '',
        fill: 'black',
  });

  function writeMessage(t, message, x_pos = 0, y_pos = 0) {
    t.text(message);
    t.absolutePosition({
      x: 10 + x_pos,
      y: 10 + y_pos,
    });
  }

  STAGE.add(LAYER);

  LAYER.add(text);
  LAYER.add(text2);

  STAGE.on('mouseup', async (_e) => {
    // e.target is a clicked Konva.Shape or current stage if you clicked on empty space
    var mousePos = STAGE.getPointerPosition();
    var absolute = STAGE.absolutePosition();
    var x = (mousePos.x - absolute.x);
    var y = (mousePos.y - absolute.y);
    writeMessage(text, 'x: ' + x + ', y: ' + y);
    writeMessage(text2, 'w: ' + canvasWidth() + ', h: ' + canvasHeight(), 0, 50);

    if (positionChanged()) {
      const trees = await fetchTrees(-1*absolute.x, -1*absolute.y, -1*absolute.x + canvasWidth(), -1*absolute.y + canvasHeight())
      trees.forEach(function (tree) { createTree(tree); });
    };

    if (x < -1*X_BOUND || y < -1*Y_BOUND || x > X_BOUND*3 || y > Y_BOUND*3) {
      STAGE.move({ x: x, y: y });
    }
  });

  STAGE.on('click', (_e) => {
    // e.target is a clicked Konva.Shape or current stage if you clicked on empty space
    const mousePos = STAGE.getPointerPosition();
    const absolute = STAGE.absolutePosition();
    const x = (mousePos.x - absolute.x)
    const y = (mousePos.y - absolute.y)

    LAYER.add(newTree(new Tree("temp", SELECTED_TREE, x, y)));

    if (CHANNEL) {
      CHANNEL?.push(CH.TREE_NEW, {x: x, y: y, type: SELECTED_TREE});
    }
  });

  start();
}

const canvasWidth = () : number => {
  return CANVAS?.offsetWidth || 0;
}

const canvasHeight = () => {
  return CANVAS?.offsetHeight || 0;
}

const fetchTrees = async (x1, y1, x2, y2) => {
  const response = await fetch('/api/trees?x1=' + x1 + '&y1=' + y1 + '&x2=' + x2 + '&y2=' + y2)
  const body = await response.json();
  return body.data;
};

const start = async () => {
  const trees = await fetchTrees(-50, -50, canvasWidth()+50, canvasHeight()+50);
  trees.forEach(function (tree) {
    createTree(tree);
  });
}

const positionChanged = () : boolean => {
  const absolute = STAGE.absolutePosition();
  if ((absolute.x != POSITION.x) || (absolute.y != POSITION.y)) {
    POSITION.x = absolute.x;
    POSITION.y = absolute.y;
    return true;
  } else {
    return false;
  }
}


export const createTree = (tree_data) => {
  if (TREES[tree_data.id] === undefined) {
    const tree = new Tree(
        tree_data.id,
        tree_data.type,
        tree_data.x,
        tree_data.y
      );

    TREES[tree.id] = tree;

    LAYER.add(newTree(tree));
  }
}

export const newTree = (tree: Tree) => {
  const group = new Konva.Group({
      id: tree.id,
      x: tree.x,
      y: tree.y,
  }).offsetX(25).offsetY(48);

  group.add(tree.image(0).clone({id: tree.id, visible: true}));
  group.add(tree.image(1).clone({id: tree.id, visible: false}));
  const images = group.getChildren();

  group.on('mouseover', function () {
    images[0].hide();
    images[1].show();
    makeNoise();
  });
  group.on('mouseout', function () {
    images[0].show();
    images[1].hide();
  });

  return group;
}

setInterval(() => {
  treesOnScreen().forEach(function (node) {
    if (Math.random() > 0.80) {
      setTimeout(() => {
        animateTree(node);
       },
        Math.floor(Math.random() * 2499)
      );
    }
  });
}, 2500)


const treesOnScreen = () => {
  return LAYER.getChildren(function(node){
    const stageAbsolute = STAGE.absolutePosition();
    const nodeAbsolute = node.position();

    return node.id()
           && node.getClassName() === 'Group'
           && (-1*stageAbsolute.x < nodeAbsolute.x)
           && (-1*stageAbsolute.x + canvasWidth() > nodeAbsolute.x)
           && (-1*stageAbsolute.y < nodeAbsolute.y)
           && (-1*stageAbsolute.y + canvasHeight() > nodeAbsolute.y)
  });
}

const animateTree = (node) => {
  const images = node.getChildren();
    images[0].hide();
    images[1].show();
    makeNoise(0.4);
  setTimeout(() => {
    images[0].show();
    images[1].hide();
  }, 350)
}