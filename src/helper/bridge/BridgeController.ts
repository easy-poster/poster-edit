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
    DelResource(params?: any) {
        window.handler.remove(params);
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

    /**
     * @description 图片翻转
     * @param type
     */
    FlipImage(type: number) {
        window.handler.flipImg(type);
    },

    /**
     * @description 前移一层
     */
    LayerForward() {
        window.handler.bringForward();
    },

    /**
     * @description 移动到最前面
     */
    LayerToFront() {
        window.handler.bringToFront();
    },

    /**
     * @description 下移一层
     */
    LayerBackwards() {
        window.handler.sendBackwards();
    },

    /**
     * @description 移动到最后面
     */
    LayerToBack() {
        window.handler.sendToBack();
    },

    /**
     * @description 锁定图层
     */
    LayerLock() {
        window.handler.lockActive();
    },

    /**
     * @description 设置fabric样式
     */
    SetFontStyle(obj: Partial<FabricObject<fabric.Object>>) {
        window.handler.setObject(obj);
    },
};

export default BridgeController;
