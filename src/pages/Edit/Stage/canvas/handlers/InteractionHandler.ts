import { fabric } from 'fabric';
import { Handler } from '.';
import { CursorType, InteractionModeType, SuperType } from '../const/defaults';

type IReturnType = { selectable?: boolean; evented?: boolean } | boolean;

/**
 * @description 交互相关
 */
class InteractionHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
        if (this.handler.editable) {
            this.selection();
        }
    }

    /**
     * 交互回调
     *
     * @param {FabricObject} obj
     * @param {(obj: FabricObject) => void} [callback]
     */
    private interactionCallback = (
        obj: FabricObject,
        callback?: (obj: FabricObject) => void,
    ) => {
        callback?.(obj);
    };

    /**
     * 图画模式
     * @returns
     */
    public isDrawingMode = () => {
        return (
            this.handler.interactionMode === InteractionModeType.LINK ||
            this.handler.interactionMode === InteractionModeType.ARROW ||
            this.handler.interactionMode === InteractionModeType.LINE ||
            this.handler.interactionMode === InteractionModeType.POLYGON
        );
    };

    /**
     * @name 选中模式
     * @param {(obj: FabricObject) => IReturnType} [callback]
     */
    public selection = (callback?: (obj: FabricObject) => IReturnType) => {
        if (this.handler.interactionMode === InteractionModeType.SELECTION) {
            return;
        }
        this.handler.interactionMode = InteractionModeType.SELECTION;
        if (typeof this.handler.canvasOption.selection === 'undefined') {
            this.handler.canvas.selection = true;
        } else {
            this.handler.canvas.selection = this.handler.canvasOption.selection;
        }

        this.handler.canvas.defaultCursor = CursorType.DEFAULT;
        this.handler.workarea!.hoverCursor = CursorType.DEFAULT;

        this.handler.getObjects().forEach((obj) => {
            if (callback) {
            } else {
                // 当selection是activeSelection时，忽略选中
                if (
                    obj.superType === SuperType.LINK ||
                    obj.superType === SuperType.PORT
                ) {
                    obj.selectable = false;
                    obj.evented = true;
                    obj.hoverCursor = CursorType.POINTER;
                    return;
                }
                if (this.handler.editable) {
                    obj.hoverCursor = CursorType.MOVE;
                } else {
                    obj.hoverCursor = CursorType.POINTER;
                }
                obj.selectable = true;
                obj.evented = true;
            }
        });
        this.handler.canvas.renderAll();
    };

    /**
     * @name 拖拽模式
     * @param {(obj: FabricObject) => IReturnType} [callback]
     */
    public grab = (callback?: (obj: FabricObject) => IReturnType) => {
        if (this.handler.interactionMode === InteractionModeType.GRAB) return;

        this.handler.interactionMode = InteractionModeType.GRAB;
        this.handler.canvas.selection = false;
        this.handler.canvas.defaultCursor = InteractionModeType.GRAB;
        this.handler.workarea!.hoverCursor = InteractionModeType.GRAB;

        this.handler.getObjects().forEach((obj) => {
            if (callback) {
                this.interactionCallback(obj, callback);
            } else {
                obj.selectable = false;
                obj.evented = this.handler.editable ? false : true;
            }
        });

        this.handler.canvas.renderAll();
        this.handler.onInteraction?.(InteractionModeType.GRAB);
    };

    /**
     * 画图模式
     * @param {InteractionMode} [type]
     * @param {(obj: FabricObject) => IReturnType} [callback]
     */
    public drawing = (
        type: InteractionMode,
        callback?: (obj: FabricObject) => IReturnType,
    ) => {
        if (this.isDrawingMode()) {
            return;
        }
        this.handler.interactionMode = type;
        this.handler.canvas.selection = false;
        this.handler.canvas.defaultCursor = 'pointer';
        this.handler.workarea!.hoverCursor = 'pointer';
        this.handler.getObjects().forEach((obj) => {
            if (callback) {
                this.interactionCallback(obj, callback);
            } else {
                obj.selectable = false;
                obj.evented = this.handler.editable ? false : true;
            }
        });
        this.handler.canvas.renderAll();
        this.handler.onInteraction?.(type);
    };

    /**
     * 连线模式
     * @param callback
     * @returns
     */
    public linking = (callback?: (obj: FabricObject) => IReturnType) => {
        if (this.isDrawingMode()) {
            return;
        }
        this.handler.interactionMode = InteractionModeType.LINK;
        this.handler.canvas.selection = false;
        this.handler.canvas.defaultCursor = 'default';
        this.handler.workarea!.hoverCursor = 'default';
        this.handler.getObjects().forEach((obj) => {
            if (callback) {
                this.interactionCallback(obj, callback);
            } else {
                if (obj.superType === 'node' || obj.superType === 'port') {
                    obj.hoverCursor = 'pointer';
                    obj.selectable = false;
                    obj.evented = true;
                    return;
                }
                obj.selectable = false;
                obj.evented = this.handler.editable ? false : true;
            }
        });
        this.handler.canvas.renderAll();
        this.handler.onInteraction?.(InteractionModeType.LINK);
    };

    /**
     * 拖拽模式下移动物体
     * @param {MouseEvent} e
     */
    public moving = (e: MouseEvent) => {
        if (this.isDrawingMode()) {
            return;
        }
        const delta = new fabric.Point(e.movementX, e.movementY);
        this.handler.canvas.relativePan(delta);
        this.handler.canvas.requestRenderAll();
        this.handler.objects.forEach((obj) => {
            if (obj.superType === 'element') {
                const { id } = obj;
                const el = this.handler.elementHandler.findById(id);
                // update the element
                this.handler.elementHandler.setPosition(el, obj);
            }
        });
    };
}

export default InteractionHandler;
