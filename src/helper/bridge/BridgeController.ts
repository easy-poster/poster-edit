/**
 * @description 外部业务调用fabric内部的事件
 */

import { FabricObjectType, FILTERTYPES } from '@/const';

interface resourceParams {
    id: string;
    type: FabricObjectType;
    src?: string;
    text?: string;
    fontSize?: number;
    fontUrl?: string;
}

const BridgeController = {
    /**
     * @description 添加资源到画布
     * @param params
     */
    AddResource(params: any) {
        window.handler.preAdd(params);
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
    SetObjectStyle(obj: Partial<FabricObject<fabric.Object>>) {
        window.handler.setObject(obj);
    },

    /**
     * @description 设置fabric样式之后，更新数据
     * @param obj
     */
    SetedObjectStyle(obj: Partial<FabricObject<fabric.Object>>) {
        window.handler.setObjected(obj);
    },

    /**
     * @description 手动触发保存
     */
    setModified() {
        window.handler.setModified();
    },

    /**
     * @description 设置滤镜
     */
    setFilter(type: FILTERTYPES, apply?: boolean) {
        window.handler.imageHandler.applyFilterByType(type, apply);
    },

    /**
     * @name 修改自定义滤镜
     * @param type
     * @param value
     */
    changeFilter(type: FILTER_TYPES, value?: any) {
        window.handler.imageHandler.onChangeFilterByType(type, value);
    },
};

export default BridgeController;
