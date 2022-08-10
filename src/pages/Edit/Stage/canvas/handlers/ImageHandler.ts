import Handler from './Handler';

export const FILTER_TYPES = [
  'grayscale',
  'invert',
  'remove-color',
  'sepia',
  'brownie',
  'brightness',
  'contrast',
  'saturation',
  'noise',
  'vintage',
  'pixelate',
  'blur',
  'sharpen',
  'emboss',
  'technicolor',
  'polaroid',
  'blend-color',
  'gamma',
  'kodachrome',
  'blackwhite',
  'blend-image',
  'hue',
  'resize',
  'tint',
  'mask',
  'multiply',
  'sepia2',
];

class ImageHandler {
  handler: Handler;

  constructor(handler: Handler) {
    this.handler = handler;
  }
}

export default ImageHandler;
