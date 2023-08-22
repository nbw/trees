import Konva from "../vendor/konva.min.js";

const TREE_LOOKUP = {
  "alder": {
    type: "alder",
    image_urls: [
      '/images/trees/cherry.png',
      '/images/trees/cherry.png'
    ],
    images: {},
    width: 100,
    height: 150,
    offsetX: 25,
    offsetY: 70,
  },
  "oak": {
    type: "oak",
    image_urls: [
      '/images/trees/seq.png',
      '/images/trees/seq.png',
      // '/images/tree.svg',
      // '/images/tree_1.png'
    ],
    images: {},
    width: 200,
    height: 500,
    offsetX: 50,
    offsetY: 245,
  },
  "stump": {
    type: "stump",
    image_urls: [
      '/images/trees/stump.png',
      '/images/trees/stump.png',
    ],
    images: {},
    width: 225,
    height: 200,
    offsetX: 65,
    offsetY: 85,
  },
  "tree": {
    type: "tree",
    image_urls: [
      '/images/trees/green_tree.png',
      '/images/trees/green_tree.png',
    ],
    images: {},
    width: 200,
    height: 300,
    offsetX: 50,
    offsetY: 135,
  }
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