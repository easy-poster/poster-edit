/**
 * @description 外部业务调用fabric内部的事件
 */

import { FabricObjectType } from '@/const';

interface resourceParams {
    id: string;
    url: string;
    type: FabricObjectType;
}

const BridgeController = {
    /**
     * @description 添加资源到画布
     * @param params
     */
    AddResource(params: resourceParams) {
        window.handler.preAdd({
            id: params.id,
            type: params.type,
            src: params.url,
        });
    },

    /**
     * @description 删除画布里的资源
     * @param params
     */
    DelResource(params: any) {},

    /**
     * @description 根据div调整画布大小
     * @param params
     */
    ResizeFromDiv(params: { width: number; height: number }) {
        window.handler.eventHandler.resize(params?.width, params?.height);
    },

    /**
     * @description 百分比调节画布大小
     * @param params
     */
    ResizeStage(params: { zoom: number }) {
        window.handler.zoomHandler.zoomToNumber(params.zoom);
    },

    /**
     * @description 百分比画布大小适应屏幕
     */
    ResizeFitStage() {
        window.handler.zoomHandler.zoomToFit();
    },

    /**
     * @description 导出画布为json
     */
    ExportStageJSON() {
        return window.handler.exportJSON();
    },

    /**
     * @description 导入数据画布
     * @param data
     * @returns
     */
    ImportStageJSONString(data: any) {
        window.handler.clear();
        window.handler.importJSON(data);
    },
};

export default BridgeController;
