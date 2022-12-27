import { fabric } from 'fabric';
import { Gif, Video } from './objects';

export interface ObjectSchema {
    create: (...option: any) => fabric.Object;
}

export interface CanvasObjectSchema {
    [key: string]: ObjectSchema;
}

export const createCanvasObject = (objectSchema: CanvasObjectSchema) =>
    objectSchema;

const CanvasObject: CanvasObjectSchema = {
    group: {
        create: ({ objects, ...option }: { objects: FabricObject[] }) =>
            new fabric.Group(objects, option),
    },
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
    video: {
        create: ({ src, file, ...option }: { src: string; file: File }) =>
            new Video(src || file, option),
    },
    gif: {
        create: (option: any) => new Gif(option),
    },
};

export default CanvasObject;
