import mitt from 'mitt';

/**
 * @description 画布相关事件
 */
enum CMD {
    /** @name 添加资源 */
    ADD_RESOURCE = 'Canvas.AddResource',
    /** @name 删除资源 */
    DEL_RESOURCE = 'Canvas.delResource',
    /**  @name 画布大小调节 */
    SIZE_STAGE = 'Canvas.SizeStage',
    /** @name 更新元素内容，大小，移动，旋转等 */
    MODIFIED_STAGE = 'Canvas.Modified',
    /** @name 选中元素 */
    SELECT = 'Canvas.Select',
    /** @name 右键上下文 */
    CONTEXT = 'Canvas.Context',
    /** @name 监听撤销重做操作 */
    TRANSACTION = 'Canvas.Transaction',
    /** @name 可撤销的操作 */
    UNDOABLR = 'Canvas.Undoable',
    /** @name 画布模式切换 */
    INTERACTIONMODE = 'Canvas.InteractionModeType',
}

type EventsParams = {
    [CMD.SELECT]?: FabricObject[] | FabricObject<fabric.Group>;
    [key: string]: any;
};

export const F2N = {
    ...CMD,
};

/**
 * @description fabric内部调用外部业务的事件
 */
const BridgeEmitter = mitt<EventsParams>();

export default BridgeEmitter;
