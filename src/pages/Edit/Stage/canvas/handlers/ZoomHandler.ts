import { fabric } from 'fabric';
import { Handler } from '.';
import { VideoObject } from '../objects/Video';

class ZoomHandler {
  handler: Handler;

  constructor(handler: Handler) {
    this.handler = handler;
  }

  public zoomToPoint = (point: fabric.Point, zoom: number) => {
    const { minZoom, maxZoom } = this.handler;
    let zoomRatio = zoom;
    if (zoom <= minZoom / 100) {
      zoomRatio = minZoom / 100;
    } else if (zoom >= maxZoom / 100) {
      zoomRatio = maxZoom / 100;
    }
    this.handler.canvas.zoomToPoint(point, zoomRatio);
    this.handler.getObjects().forEach((obj) => {
      if (obj.superType === 'element') {
        const { id, width, height, player } = obj as VideoObject;
        const el = this.handler.elementHandler.findById(id);
        // update the element
        this.handler.elementHandler.setScaleOrAngle(el, obj);
        this.handler.elementHandler.setSize(el, obj);
        this.handler.elementHandler.setPosition(el, obj);
        if (player) {
          player.setPlayerSize(width, height);
        }
      }
    });
    if (this.handler.onZoom) {
      this.handler.onZoom(zoomRatio);
    }
    this.handler.canvas.requestRenderAll();
  };

  /**
   * Zoom one to one
   *
   */
  public zoomOneToOne = () => {
    const center = this.handler.canvas.getCenter();
    this.handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    this.zoomToPoint(new fabric.Point(center.left, center.top), 1);
  };
}

export default ZoomHandler;
