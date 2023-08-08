import Konva from "../vendor/konva.min.js";

const TREE_LOOKUP = {
  "alder": {
    type: "alder",
    image_urls: [
      '/images/tree.svg',
      '/images/tree_1.png'
    ],
    images: {},
    width: 50,
    height: 50,
  },
  "oak": {
    type: "oak",
    image_urls: [
      '/images/tree.svg',
      '/images/tree_1.png'
    ],
    images: {},
    width: 50,
    height: 50,
  }
}

/**
 * Prebuild all the assets, which will be used (cloned) onto the canvas
 * */
export const build_tree_lookup = () => {
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
          height: TREE_LOOKUP[tree.type].height
        });
      }
      tree.image_urls[i]
    }
  });
  console.log(TREE_LOOKUP);
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