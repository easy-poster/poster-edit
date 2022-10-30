import { fabric } from 'fabric';
import { Handler } from '.';
import { CursorType, InteractionModeType, SuperType } from '../const/defaults';

type IReturnType = { selectable?: boolean; evented?: boolean } | boolean;

class InteractionHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
        if (this.handler.editable) {
            this.selection();
        }
    }

    /**
     * 改成选中模式
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
        this.handler.workarea.hoverCursor = CursorType.DEFAULT;

        this.handler.getObjects().forEach((obj) => {
            if (callback) {
            } else {
                // 当selection是activeSelection时，忽略选中
                if (obj.superType === SuperType.LINK || obj.superType === SuperType.PORT) {
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
}

export default InteractionHandler;
