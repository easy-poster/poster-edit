import Handler from './Handler';
import { fabric } from 'fabric';
import { ALLFILTERS, FILTERTYPES, FILTER_CUSTOMIZE } from '@/const';
// import '../filters';

const SHARPEN_MATRIX = [0, -1, 0, -1, 5, -1, 0, -1, 0];
const EMBOSS_MATRIX = [1, 1, 1, 1, 0.7, -1, -1, -1, -1];

/**
 * @description 画布添加图片相关
 */
class ImageHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
    }

    /**
     * @name 创建滤镜对象
     * @param filter 滤镜参数
     * @returns
     */
    public createFilter = (filter: IFilter) => {
        const { type: filterType, ...other } = filter;
        switch (filterType.toLowerCase()) {
            case FILTER_CUSTOMIZE.brightness:
                return new fabric.Image.filters.Brightness({
                    brightness: other.brightness,
                });
            case FILTER_CUSTOMIZE.contrast:
                return new fabric.Image.filters.Contrast({
                    contrast: other.contrast,
                });
            case FILTER_CUSTOMIZE.saturation:
                return new fabric.Image.filters.Saturation({
                    saturation: other.saturation,
                });
            // case FILTER_CUSTOMIZE.temperature:
            //     return new fabric.Image.filters.Temperature({
            //         temperature: other.temperature || 0,
            //     });
            case FILTERTYPES.grayscale:
                return new fabric.Image.filters.Grayscale(other);
            case FILTERTYPES.invert:
                return new fabric.Image.filters.Invert();
            case FILTERTYPES['blend-color']:
                return new fabric.Image.filters.BlendColor(other);
            case FILTERTYPES['blend-image']:
                return new fabric.Image.filters.BlendImage(other);
            case FILTERTYPES.sepia:
                return new fabric.Image.filters.Sepia();
            case FILTERTYPES.noise:
                return new fabric.Image.filters.Noise({ noise: other.noise });
            case FILTERTYPES.pixelate:
                return new fabric.Image.filters.Pixelate(other);
            case FILTERTYPES.sharpen:
                return new fabric.Image.filters.Convolute({
                    matrix: SHARPEN_MATRIX,
                });
            case FILTERTYPES.emboss:
                return new fabric.Image.filters.Convolute({
                    matrix: EMBOSS_MATRIX,
                });
            case FILTERTYPES.resize:
                return new fabric.Image.filters.Resize(other);
            case FILTERTYPES.mask:
                return new fabric.Image.filters.Mask({
                    channel: other.channel,
                    mask: other.mask,
                });
            case FILTERTYPES.multiply:
                return new fabric.Image.filters.Multiply({
                    color: other.color,
                });
            case FILTERTYPES.sepia2:
                return new fabric.Image.filters.Sepia2(other);
            default:
                return false;
        }
    };

    /**
     * @name 创建多个滤镜
     * @param filters
     * @returns
     */
    public createFilters = (filters: IFilter[]) => {
        return filters.reduce((prev: any, filter) => {
            let type = filter?.type;
            const findIndex = Object.keys(ALLFILTERS).findIndex(
                (filterType) => type.toLowerCase() === filterType,
            );
            if (findIndex > -1) {
                prev[findIndex] = this.createFilter({
                    ...filter,
                    type,
                });
            }
            return prev;
        }, []);
    };

    /**
     * @name 通过type应用滤镜·
     * @param {string} type
     * @param {*} [value]
     * @param {fabric.Image} [imageObj]
     */
    public applyFilterByType = (
        type: FILTERTYPES,
        apply = true,
        value?: any,
        imageObj?: fabric.Image,
    ): void => {
        const obj = imageObj || (this.handler.canvas.getActiveObject() as any);
        const findIndex = Object.keys(ALLFILTERS).findIndex(
            (ft) => ft.toLowerCase() === type,
        );
        if (obj.filters && findIndex > -1) {
            if (apply) {
                obj.filters[findIndex] = this.createFilter({
                    type,
                    ...value,
                });
                obj.applyFilters();
            } else {
                obj.filters[findIndex] = false;
                obj.applyFilters();
            }
            this.handler.canvas.requestRenderAll();
        }
    };

    /**
     * @name 根据type修改滤镜强度
     * @param type
     * @param value
     * @param imageObj
     */
    public onChangeFilterByType = (
        type: FILTER_CUSTOMIZE,
        value?: any,
        imageObj?: fabric.Image,
    ): void => {
        const obj = imageObj || (this.handler.canvas.getActiveObject() as any);
        if (type) {
            const findIndex = Object.keys(ALLFILTERS).findIndex(
                (ft) => ft.toLowerCase() === type,
            );
            if (obj.filters && findIndex > -1) {
                obj.filters[findIndex] = this.createFilter({
                    type,
                    ...value,
                });
                obj.applyFilters();
                this.handler.canvas.requestRenderAll();
            }
        }
    };
}

export default ImageHandler;
