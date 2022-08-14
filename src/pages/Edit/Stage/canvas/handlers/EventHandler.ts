import { fabric } from 'fabric';
import { Handler } from '.';
import { WorkareaLayoutType } from '../const/defaults';

class EventHandler {
  handler: Handler;
  code: string;
  panning: boolean;

  constructor(handler: Handler) {
    this.handler = handler;
    this.init();
  }

  public init() {
    if (this.handler.editable) {
      // @ts-ignore
      this.handler.canvas.on({
        'mouse:wheel': this.mousewheel,
        'mouse:down': this.mousedown,
        'mouse:move': this.mousemove,
        'mouse:up': this.mouseup,
      });
    } else {
      // @ts-ignore
      this.handler.canvas.on({
        'mouse:wheel': this.mousewheel,
        'mouse:down': this.mousedown,
        'mouse:move': this.mousemove,
        'mouse:up': this.mouseup,
      });
    }
  }

  /**
   * 画布大小调节
   * @param nextWidth
   * @param nextHeight
   * @returns
   */
  public resize = (nextWidth: number, nextHeight: number) => {
    this.handler.canvas.setWidth(nextWidth).setHeight(nextHeight);
    this.handler.canvas.renderAll.bind(this.handler.canvas);
    if (!this.handler.workarea && this.handler.canvasOption) {
      return;
    }
    if (!this.handler.width || !this.handler.height) return;
    const diffWidth = nextWidth / 2 - this.handler.width / 2;
    const diffHeight = nextHeight / 2 - this.handler.height / 2;
    this.handler.width = nextWidth;
    this.handler.height = nextHeight;

    if (this.handler.workarea.layout === WorkareaLayoutType.FIXED) {
      this.handler.canvas.centerObject(this.handler.workarea);
      this.handler.workarea.setCoords();
      if (this.handler.gridOption.enabled) {
        return;
      }
      this.handler.canvas.getObjects().forEach((obj: FabricObject) => {
        if (obj?.id !== 'workarea' && obj.left && obj.top) {
          const left = obj?.left + diffWidth;
          const top = obj?.top + diffHeight;
          obj.set({
            left,
            top,
          });
          obj.setCoords();
          if (obj.superType === 'element') {
            const { id } = obj;
            const el = this.handler.elementHandler.findById(id);
            // update the element
            this.handler.elementHandler.setPosition(el, obj);
          }
        }
      });
      this.handler.canvas.renderAll();
      return;
    }
  };

  /**
   * 鼠标滚轮放大缩小
   *
   * @param {FabricEvent<WheelEvent>} opt
   * @returns
   */
  public mousewheel = (opt: FabricEvent) => {
    const event = opt as FabricEvent<WheelEvent>;
    const { zoomEnabled } = this.handler;
    if (!zoomEnabled) {
      return;
    }
    const delta = event.e.deltaY;
    let zoomRatio = this.handler.canvas.getZoom();
    if (delta > 0) {
      zoomRatio -= 0.05;
    } else {
      zoomRatio += 0.05;
    }
    this.handler.zoomHandler.zoomToPoint(
      new fabric.Point(
        this.handler.canvas.getWidth() / 2,
        this.handler.canvas.getHeight() / 2,
      ),
      zoomRatio,
    );
    event.e.preventDefault();
    event.e.stopPropagation();
  };

  public mousedown() {}

  public mousemove() {}

  public mouseup() {}
}

export default EventHandler;
