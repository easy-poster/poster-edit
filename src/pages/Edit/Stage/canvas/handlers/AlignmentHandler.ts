import { fabric } from 'fabric';
import { Handler } from '.';

/**
 * @description 选中组的对齐方式
 */
class AlignmentHandler {
    handler: Handler;
    constructor(handler: Handler) {
        this.handler = handler;
    }

    /**
     * @name 选中左对齐
     */
    public left = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (
            activeObject &&
            activeObject?.width &&
            activeObject?.type === 'activeSelection'
        ) {
            const activeSelection = activeObject as fabric.ActiveSelection;
            const activeObjectLeft = -(activeObject.width / 2);
            activeSelection.forEachObject((obj) => {
                obj.set({
                    left: activeObjectLeft,
                });
                obj.setCoords();
                this.handler.canvas.renderAll();
            });
        }
    };

    /**
     * @name 选中中心对齐
     */
    public center = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject as fabric.ActiveSelection;
            activeSelection.forEachObject((obj) => {
                if (!obj.width || !obj.scaleX) return;
                obj.set({
                    left: 0 - (obj?.width * obj?.scaleX) / 2,
                });
                obj.setCoords();
                this.handler.canvas.renderAll();
            });
        }
    };

    /**
     * @name 选中右对齐
     */
    public right = () => {
        const activeObject = this.handler.canvas.getActiveObject();
        if (
            activeObject &&
            activeObject.width &&
            activeObject.type === 'activeSelection'
        ) {
            const activeSelection = activeObject as fabric.ActiveSelection;
            const activeObjectLeft = activeObject.width / 2;
            activeSelection.forEachObject((obj) => {
                if (!obj.width || !obj.scaleX) return;
                obj.set({
                    left: activeObjectLeft - obj.width * obj.scaleX,
                });
                obj.setCoords();
                this.handler.canvas.renderAll();
            });
        }
    };
}

export default AlignmentHandler;
