import Konva from "../vendor/konva.min.js";

export const TREE_LOOKUP = {
  "sakura": {
    type: "sakura",
    image_urls: [
      '/images/trees/cherry.png',
      '/images/trees/cherry_alt.png'
    ],
    images: {},
    instrument: 0,
    notes: ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4"],
    width: 115,
    height: 150,
    offsetX: 28,
    offsetY: 70,
  },
  "seq": {
    type: "seq",
    image_urls: [
      '/images/trees/seq.png',
      '/images/trees/seq_alt.png',
    ],
    images: {},
    instrument: 1,
    notes: [, "Ab3", "Bb3","C3", "D3", "Eb3", "F3", "G3"],
    width: 200,
    height: 510,
    offsetX: 50,
    offsetY: 247,
  },
  "stump": {
    type: "stump",
    image_urls: [
      '/images/trees/stump.png',
      '/images/trees/stump_alt.png',
    ],
    images: {},
    instrument: 2,
    notes: ["C3", "D3", "Eb3", "F3", "G3", "Ab3", "Bb3"],
    width: 230,
    height: 200,
    offsetX: 65,
    offsetY: 78,
  },
  // "tree": {
  //   type: "tree",
  //   image_urls: [
  //     '/images/trees/green_tree.png',
  //     '/images/trees/green_tree.png',
  //   ],
  //   images: {},
  //   instrument: 0,
  //   notes: ["C4","D4", "E4"],
  //   width: 200,
  //   height: 300,
  //   offsetX: 50,
  //   offsetY: 135,
  // }
}

const countImages = () : number => {
  let total = 0;
  Object.values(TREE_LOOKUP).forEach((tree) => {
    total += tree.image_urls.length;
  });
  return total;
}

/**
 * Prebuild all the assets, which will be used (cloned) onto the canvas
 * */
export const build_tree_lookup = async () => {
  return new Promise((resolve) => {
    const totalImages = countImages();
    let loadedImages = 0;

    Object.values(TREE_LOOKUP).forEach((tree) => {
      for (let i = 0; i < tree.image_urls.length; i++) {
        const image = new Image();
        image.src = tree.image_urls[i];
        image.onload = () => {
          TREE_LOOKUP[tree.type]["images"][i] = new Konva.Image({
            x: 0,
            y: 0,
            image: image,
            width: TREE_LOOKUP[tree.type].width,
            height: TREE_LOOKUP[tree.type].height,
            offsetX: TREE_LOOKUP[tree.type].offsetX,
            offsetY: TREE_LOOKUP[tree.type].offsetY,
          });

          loadedImages++;

          if (loadedImages >= totalImages) {
            resolve('finished loading images');
          }
        }
        tree.image_urls[i]
      }
    });
  });
}

export class Tree {
  id: number;
  type: string;
  x: number;
  y: number;
  shape: any;

  constructor(id, type, x, y) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
  }

  image(index: number) {
    return TREE_LOOKUP[this.type].images[index];
  }
}