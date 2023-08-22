import Konva from "../vendor/konva.min.js";
import {
  CANVAS,
  CHANNEL,
  MAIN_LAYER,
  SECONDARY_LAYER,
  POSITION,
  ACTION,
  STAGE,
  TREES,
} from "./state.js";
import {
  BOUND,
  CH,
  SOUND
} from "./constants.js";
import { makeNoise } from "./noise.js";
import {Tree, build_tree_lookup} from "./tree.js";
import {
  start as startForeground
} from "./foreground.js"
import {
  start as startBackground,
  fillBackground
} from "./background.js"


export const go = async () => {
  await build_tree_lookup();

  const X_BOUND = 50000;
  const Y_BOUND = 50000;

  startBackground();
  STAGE.add(SECONDARY_LAYER);
  STAGE.add(MAIN_LAYER);
  startForeground();

  STAGE.on('mouseup', async (_e) => {
    // e.target is a clicked Konva.Shape or current stage if you clicked on empty space
    var mousePos = STAGE.getPointerPosition();
    var absolute = STAGE.absolutePosition();
    var x = (mousePos.x - absolute.x);
    var y = (mousePos.y - absolute.y);

    if (positionChanged()) {
      fillBackground();
      const trees = await fetchTrees(-1*absolute.x, -1*absolute.y, -1*absolute.x + canvasWidth(), -1*absolute.y + canvasHeight())
      trees.forEach(function (tree) { createTree(tree); });
    };

    if (x < -1*BOUND.X || y < -1*BOUND.Y || x > BOUND.X*3 || y > BOUND.Y*3) {
      STAGE.move({ x: x, y: y });
    }
  });

  STAGE.on('click', (_e) => {
    if (ACTION === "destroy") {
      return;
    } else {
      // e.target is a clicked Konva.Shape or current stage if you clicked on empty space
      const mousePos = STAGE.getPointerPosition();
      const absolute = STAGE.absolutePosition();
      const x = (mousePos.x - absolute.x)
      const y = (mousePos.y - absolute.y)

      const t = newTree(new Tree("temp", ACTION, x, y))
      drawNodesInOrder(t)

      if (CHANNEL) {
        CHANNEL?.push(CH.TREE_NEW, {x: x, y: y, type: ACTION});
      }
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
    createTree(tree, true);
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

export const createTree = (tree_data, skipDrawInOrder = false) => {
  if (TREES[tree_data.id] === undefined) {
    const tree = new Tree(
        tree_data.id,
        tree_data.type,
        tree_data.x,
        tree_data.y
      );

    TREES[tree.id] = tree;

    if (skipDrawInOrder) {
      MAIN_LAYER.add(newTree(tree));
    } else {
      drawNodesInOrder(newTree(tree));
    }

  }
}

export const destroyTree = (tree_data) => {
  if (TREES[tree_data.id] != undefined) {
    const node = MAIN_LAYER.findOne(`#${tree_data.id}`);
    if (node) {
      node.destroy();
      TREES[tree_data.id] = undefined;
    }
  }
}
export const newTree = (tree: Tree) => {
  const group = new Konva.Group({
      id: `${tree.id}`,
      x: tree.x,
      y: tree.y,
  });

  group.add(tree.image(0).clone({id: tree.id, visible: true}));
  group.add(tree.image(1).clone({id: tree.id, visible: false}));
  group.offsetX(tree.image(0).offsetX());
  group.offsetY(tree.image(0).offsetY());
  const images = group.getChildren();

  group.on('mouseover', function () {
    images[0].hide();
    images[1].show();
    animateWaterRings(this);
    makeNoise();
  });
  group.on('mouseout', function () {
    images[0].show();
    images[1].hide();
  });

  group.on('click', function () {
    if (ACTION === "destroy") {
      group.destroy();
      CHANNEL?.push(CH.TREE_DESTROY, {id: tree.id});
    }
  });

  return group;
}

setInterval(() => {
  treesOnScreen().forEach(function (node) {
    if (Math.random() > SOUND.NOISE_PROBABILITY) {
      setTimeout(() => {
        if (node) { animateTree(node); }
       },
        Math.floor(Math.random() * 2499)
      );
    }
  });
}, 2500)


const treesOnScreen = () => {
  const stageAbsolute = STAGE.absolutePosition();

  return MAIN_LAYER.getChildren(function(node){
    const nodePosition = node.position();

    return node.id()
           && node.getClassName() === 'Group'
           && (-1*stageAbsolute.x < nodePosition.x)
           && (-1*stageAbsolute.x + canvasWidth() > nodePosition.x)
           && (-1*stageAbsolute.y < nodePosition.y)
           && (-1*stageAbsolute.y + canvasHeight() > nodePosition.y)
  });
}

const collidingNodes = (refNode) => {
  return MAIN_LAYER.getChildren(function (node) {
    return refNode.id() !== "temp"
           && (refNode.id() != node.id())
           && haveIntersection(refNode.getClientRect(), node.getClientRect());
  });
}

const haveIntersection = (r1, r2) => {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

const animateTree = (node) => {
  if (node) {
    const images = node.getChildren();
      images[0].hide();
      images[1].show();
      animateWaterRings(node)
      makeNoise(SOUND.BG_VOLUME);
    setTimeout(() => {
      images[0].show();
      images[1].hide();
    }, 350);
  }
}

const animateWaterRings = (node) => {
  drawGrowingCircle(node.x(), node.y(), 0.5, SECONDARY_LAYER);
  setTimeout(()=> {
    drawGrowingCircle(node.x(), node.y(), 0.3, SECONDARY_LAYER);
  }, 600)
} 

const drawGrowingCircle = (x, y, baseOpacity, layer) => {
  const node = new Konva.Circle({
    x: x,
    y: y,
    radius: 300,
    stroke: 'white',
    strokeWidth: 1,
    opacity: 0.0,
    scale: 0.015
  });

  const skew = 4;
  const anim = new Konva.Animation(function (frame) {
      const newScale = frame.time/15000.0 + 0.001;
      const newOpacity = baseOpacity*(1-frame.time/2500.0);

      node.scale({ x: newScale*skew, y: newScale });
      if (newOpacity < 0) {
        node.destroy();
      } else {
        node.opacity(newOpacity*0.90);
      }
    }, MAIN_LAYER);

  anim.start();

  layer.add(node);
}

const drawNodesInOrder = (newNode) => {
  const nodes = collidingNodes(newNode);
  const clones = nodes.map((n) => {
    if (n !== undefined && n.id() !== "temp") {
      return newTree(TREES[n.id()]);
    }
  }).filter((n) => n !== undefined);
  nodes.forEach((n) => n.destroy());
  clones.push(newNode);
  clones.sort((a, b) => a.y() - b.y())
  clones.forEach((n) => MAIN_LAYER.add(n));
}