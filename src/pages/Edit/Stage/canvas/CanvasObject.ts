import { fabric } from 'fabric';

export interface ObjectSchema {
  create: (...option: any) => fabric.Object;
}

export interface CanvasObjectSchema {
  [key: string]: ObjectSchema;
}

export const createCanvasObject = (objectSchema: CanvasObjectSchema) =>
  objectSchema;

const CanvasObject: CanvasObjectSchema = {
  'i-text': {
    create: ({ text, ...option }: { text: string }) =>
      new fabric.IText(text, option),
  },
  textbox: {
    create: ({ text, ...option }: { text: string }) =>
      new fabric.Textbox(text, option),
  },
  image: {
    create: ({ element = new Image(), ...option }) =>
      new fabric.Image(element, {
        ...option,
        crossOrigin: 'anonymous',
      }),
  },
};

export default CanvasObject;
