import { fabric } from 'fabric';
import { Handler } from '.';

class WorkareaHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
        this.init();
    }

    public init() {
        const { workareaOption } = this.handler;
        // const image = new Image(workareaOption.width, workareaOption.height);
        // image.width = workareaOption.width || 600;
        // image.height = workareaOption.height || 600;
        // this.handler.workarea = new fabric.Image(
        //   image,
        //   workareaOption,
        // ) as WorkareaObject;
        this.handler.workarea = new fabric.Rect({
            width: workareaOption.width || 600,
            height: workareaOption.height || 600,
            absolutePositioned: true,
            fill: '#FFF',
            hasControls: true,
            transparentCorners: false,
            borderColor: '#0E98FC',
            cornerColor: '#0E98FC',
            selectable: false,
            ...workareaOption,
        });
        this.handler.canvas.clipPath = this.handler.workarea;
        this.handler.canvas.add(this.handler.workarea);
        this.handler.objects = this.handler.getObjects();
        this.handler.canvas.centerObject(this.handler.workarea);
        this.handler.canvas.renderAll();
    }
}

export default WorkareaHandler;
