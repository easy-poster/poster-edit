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
     * @name 添加资源到画布
     * @param params
     */
    AddResource(params: any) {
        window.handler.preAdd(params);
    },

    /**
     * @name 删除画布里的资源
     * @param params
     */
    DelResource(params?: any) {
        window.handler.remove(params);
    },

    /**
     * @name 百分比调节画布大小
     * @param params
     */
    ResizeStage(params: { zoom: number }) {
        window.handler.zoomHandler.zoomToNumber(params.zoom);
    },

    /**
     * @name 百分比画布大小适应屏幕
     */
    ResizeFitStage() {
        window.handler.zoomHandler.zoomToFit();
    },

    /**
     * @name 导出画布为json
     */
    ExportStageJSON() {
        return window.handler.exportJSON();
    },

    /**
     * @name 导入数据画布
     * @param data
     * @returns
     */
    ImportStageJSONString(data: any) {
        window.handler.clear();
        window.handler.importJSON(data);
    },

    /**
     * @name 图片翻转
     * @param type
     */
    FlipImage(type: number) {
        window.handler.flipImg(type);
    },

    /**
     * @name 前移一层
     */
    LayerForward() {
        window.handler.bringForward();
    },

    /**
     * @name 移动到最前面
     */
    LayerToFront() {
        window.handler.bringToFront();
    },

    /**
     * @name 下移一层
     */
    LayerBackwards() {
        window.handler.sendBackwards();
    },

    /**
     * @name 移动到最后面
     */
    LayerToBack() {
        window.handler.sendToBack();
    },

    /**
     * @name 锁定图层
     */
    LayerLock() {
        window.handler.lockActive();
    },

    /**
     * @name 复制元素
     */
    copyObject() {
        window.handler.copy();
    },

    /**
     * @name 粘贴元素
     */
    pasteObject() {
        window.handler.paste();
    },

    /**
     * @name 设置fabric样式
     */
    SetObjectStyle(obj: Partial<FabricObject<fabric.Object>>) {
        window.handler.setObject(obj);
    },

    /**
     * @name 设置fabric样式之后,更新数据
     * @param obj
     */
    SetedObjectStyle(obj: Partial<FabricObject<fabric.Object>>) {
        window.handler.setObjected(obj);
    },

    /**
     * @name 手动触发更新并保存
     */
    setModified() {
        window.handler.setModified();
    },

    /**
     * @name 设置滤镜
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

    /**
     * @name 设置背景
     * @param type 设置背景类型
     * @param value type为color则value为#FFF, type为IMAGE则value为地址
     */
    setWorkAreaBg(type: 'COLOR' | 'IMAGE', value: string) {
        window.handler.workareaHandler.setBg(type, value);
    },

    /**
     * @name 选中设置为组
     */
    setToGroup() {
        window.handler.toGroup();
    },

    /**
     * @name 选中对象拆分组
     */
    setToActiveSelection() {
        window.handler.toActiveSelection();
    },
};

export default BridgeController;
