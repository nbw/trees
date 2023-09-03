import {
  BACKGROUND_LAYER,
  CANVAS,
  STAGE
} from "./state.js";
import Konva from "../vendor/konva.min.js";

// PIXEL_DENSITY specks per PIXEL_DENSITY_SIZE pixels 
const PIXEL_SIZE = 5;
const PIXEL_DENSITY = 20;
const PIXEL_DENSITY_SIZE = 200;
const COLORS = [
  "#1A7F71",
  "#318583",
  "#1B545B",
  "#6AB176",
  "#31432B",
  "#81C59B",
  "#134458",
  "#24472A",
  "#2E5277",
  "#46749C",
  "#1E4243",
  "#3DF6DF"
];

export const start = () => {
  STAGE.add(BACKGROUND_LAYER);
  fillBackground();
}

const createSpeck = (x : number, y : number) => {
  let rect = new Konva.Rect({
        name: "speck",
        x: x,
        y: y,
        width: Math.floor(Math.random()*PIXEL_SIZE),
        height: Math.floor(Math.random()*PIXEL_SIZE),
        fill: COLORS[Math.floor(Math.random()*COLORS.length)]
  });

  BACKGROUND_LAYER.add(rect);
}


const objectsOnScreen = (name) => {
  const stageAbsolute = STAGE.absolutePosition();

  return BACKGROUND_LAYER.getChildren(function(node){
    const nodePosition = node.position();

    return node.name() === name
           && (-1*stageAbsolute.x < nodePosition.x)
           && (-1*stageAbsolute.x + canvasWidth() > nodePosition.x)
           && (-1*stageAbsolute.y < nodePosition.y)
           && (-1*stageAbsolute.y + canvasHeight() > nodePosition.y)
  });
}

const divideNodesBySection = (nodes, size) => {
  const columns = Math.floor(canvasWidth()/PIXEL_DENSITY_SIZE) + 1;
  const rows = Math.floor(canvasHeight()/PIXEL_DENSITY_SIZE) + 1;
  const grid = new Array(columns);
  for(let i = 0; i < grid.length; i++) {
    grid[i] = [];
    for(let j = 0; j < rows; j++) {
      grid[i].push([]);
    }
  }
  nodes.forEach((node) => {
    const stageAbsolute = STAGE.absolutePosition();
    const nodePosition = node.position();
    const x = Math.floor((stageAbsolute.x + nodePosition.x)/size);
    const y = Math.floor((stageAbsolute.y + nodePosition.y)/size);
    if (x < 0 || x >= columns) return;
    if (y < 0 || y >= rows) return;
    grid[x][y].push(node);
  });

  return grid;
}

export const fillBackground = () => {
  const stageAbsolute = STAGE.absolutePosition();
  const specks = objectsOnScreen("speck");
  const grid = divideNodesBySection(specks, PIXEL_DENSITY_SIZE);
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      for(let h = grid[i][j].length; h < PIXEL_DENSITY; h++) {
        createSpeck(
          -1*stageAbsolute.x + PIXEL_DENSITY_SIZE*i + Math.floor(Math.random()*PIXEL_DENSITY_SIZE),
          -1*stageAbsolute.y + PIXEL_DENSITY_SIZE*j + Math.floor(Math.random()*PIXEL_DENSITY_SIZE)
        )
      }
    }
  }
}


const canvasWidth = () : number => {
  return CANVAS?.offsetWidth || 0;
}

const canvasHeight = () => {
  return CANVAS?.offsetHeight || 0;
}
