import Handler from './Handler';
import { fabric } from 'fabric';

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

export enum FILTERTYPES {
    grayscale = 'grayscale',
    invert = 'invert',
    blendColor = 'blend-color',
}

export interface IFilter {
    type: typeof FILTER_TYPES[number];
    [key: string]: any;
}

/**
 * @description 画布添加图片相关
 */
class ImageHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
    }

    /**
     * 创建滤镜对象
     * @param filter 滤镜参数
     * @returns
     */
    public createFilter = (filter: IFilter) => {
        const { type: filterType, ...other } = filter;
        switch (filterType) {
            case FILTERTYPES.grayscale:
                return new fabric.Image.filters.Grayscale(other);
            case FILTERTYPES.invert:
                return new fabric.Image.filters.Invert();
            case FILTERTYPES.blendColor:
                return new fabric.Image.filters.BlendColor(other);
            default:
                return false;
        }
    };
}

export default ImageHandler;
