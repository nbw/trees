import {
  FOREGROUND_LAYER,
  CANVAS,
  STAGE,
} from "./state";
import {
  COLOR
} from "./constants"
import Konva from "../vendor/konva.min.js";

const LEAF_SIZE = 3;
const LEAF_COUNT = 20;

const createLeaf = (x : number, y : number) => {
  const size = LEAF_SIZE;
  let rect = new Konva.Rect({
        name: "speck",
        x: x,
        y: y,
        width: size*1.5,
        height: size,
        fill: COLOR.LEAF_GREEN
  }).offsetX(Math.floor(size/2)).offsetY(Math.floor(size/2));
  rect = animateLeaf(rect);

  FOREGROUND_LAYER.add(rect);
}

const animateLeaf = (node) => {
  const angularSpeed = 180;
  const anim = new Konva.Animation(function (frame) {
      const angleDiff = (frame.timeDiff * angularSpeed) / 1000;
      node.rotate(angleDiff);
      node.x(node.x() - 0.5);
      node.y(node.y() + 1);
      const newScale = node.scaleX()*0.99;
      node.scale({ x: newScale*0.99, y: newScale*0.97 });
    }, FOREGROUND_LAYER);

  anim.start();
  setTimeout(() => { node.destroy();}, 1250)

  return node;
}

const canvasWidth = () : number => {
  return CANVAS?.offsetWidth || 0;
}

const canvasHeight = () => {
  return CANVAS?.offsetHeight || 0;
}

const animateLeaves = ( ) => {
  setInterval(() => {
    const leaves = Math.floor(Math.random()*LEAF_COUNT)
    for(let i = 0; i < leaves; i ++) {
      setTimeout(() =>  {
        const stageAbsolute = STAGE.absolutePosition();
        createLeaf(
          -1*stageAbsolute.x + Math.floor(Math.random()*canvasWidth()),
          -1*stageAbsolute.y + Math.floor(Math.random()*canvasHeight())
        )
      }, Math.floor(250 + Math.random()*5000));
    }
  }, Math.floor(1500 + Math.random()*3000))
}


export const start = () => {
  STAGE.add(FOREGROUND_LAYER);
  animateLeaves();
}


