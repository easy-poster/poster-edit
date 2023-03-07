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
        switch (filterType?.toLowerCase()) {
            case FILTERTYPES.grayscale:
                return new fabric.Image.filters.Grayscale(other);
            case FILTERTYPES.invert:
                return new fabric.Image.filters.Invert();
            case FILTERTYPES['blend-color']:
                return new fabric.Image.filters.BlendColor(other);
            // case FILTERTYPES['blend-image']:
            //     return new fabric.Image.filters.BlendImage(other);
            case FILTERTYPES.sepia:
                return new fabric.Image.filters.Sepia();
            case FILTERTYPES.noise:
                return new fabric.Image.filters.Noise({
                    noise: other.noise || 60,
                });
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
            // case FILTERTYPES.resize:
            //     return new fabric.Image.filters.Resize(other);
            // case FILTERTYPES.mask:
            //     return new fabric.Image.filters.Mask({
            //         channel: other.channel,
            //         mask: other.mask,
            //     });
            // case FILTERTYPES.multiply:
            //     return new fabric.Image.filters.Multiply({
            //         color: other.color || '#000',
            //     });
            // case FILTERTYPES.sepia2:
            //     return new fabric.Image.filters.Sepia2(other);
            // 以下是默认的滤镜
            case FILTER_CUSTOMIZE.brightness:
                return new fabric.Image.filters.Brightness({
                    brightness: other.brightness || 0,
                });
            case FILTER_CUSTOMIZE.contrast:
                return new fabric.Image.filters.Contrast({
                    contrast: other.contrast || 0,
                });
            case FILTER_CUSTOMIZE.saturation:
                return new fabric.Image.filters.Saturation({
                    saturation: other.saturation || 0,
                });
            // case FILTER_CUSTOMIZE.temperature:
            //     return new fabric.Image.filters.Temperature({
            //         temperature: other.temperature || 0,
            //     });
            default:
                return undefined;
        }
    };

    /**
     * @name 创建多个滤镜
     * @param filters
     * @returns
     */
    public createFilters = (filters: IFilter[] & any) => {
        // 如果没没有调节的滤镜则添加
        const filterOrder = Object.values(FILTER_CUSTOMIZE);
        for (let i = 0; i < filterOrder.length; i++) {
            let findIndex = filters.findIndex(
                (ft: { type: { toLowerCase: () => FILTER_CUSTOMIZE } }) =>
                    ft?.type?.toLowerCase() === filterOrder[i],
            );
            if (findIndex < 0) {
                filters.push(
                    this.createFilter({
                        type: filterOrder[i],
                    }),
                );
            }
        }

        return filters.reduce((prev: any, filter: IFilter) => {
            let type = filter?.type;
            const findIndex = filters.findIndex(
                (ft: { type: string }) =>
                    ft?.type?.toLowerCase() === type?.toLowerCase(),
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
        if (!obj?.filters) return;

        let findIndex = obj.filters.findIndex(
            (ft: { type: string }) =>
                !Object.keys(FILTER_CUSTOMIZE).includes(
                    ft?.type?.toLowerCase(),
                ),
        );
        if (apply) {
            if (findIndex > 0) {
                obj.filters[findIndex] = this.createFilter({
                    type,
                    ...value,
                });
            } else {
                obj.filters.push(
                    this.createFilter({
                        type,
                        ...value,
                    }),
                );
            }
        } else {
            if (findIndex > 0) {
                obj.filters[findIndex] = false;
            }
        }
        obj.applyFilters();
        this.handler.canvas.requestRenderAll();

        const onModified = this.handler?.onModified;
        if (onModified) {
            onModified(obj);
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
            const findIndex = Object.keys(FILTER_CUSTOMIZE).findIndex(
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
