import { fabric } from 'fabric';
import { Handler } from '.';

const LINECOLOR = '#41b349'; //'#4dc991';

/**
 * @description 对齐辅助线
 */
class GuidelineHandler {
    handler: Handler;
    verticalLines!: { x: number; y1: number; y2: number }[];
    horizontalLines!: { y: number; x1: number; x2: number }[];
    ctx!: CanvasRenderingContext2D;
    viewportTransform!: number[];

    aligningLineOffset = 5;
    aligningLineMargin = 4;
    aligningLineWidth = 1;
    aligningLineColor = LINECOLOR;
    zoom = 1;

    constructor(handler: Handler) {
        this.handler = handler;
        this.init();
    }

    public init() {
        if (this.handler.guidelineOption?.enabled) {
            // @ts-ignore
            this.handler.canvas.on({
                'before:render': this.beforeRender,
                'after:render': this.afterRender,
            });
        } else {
            this.destroy();
        }

        this.ctx = this.handler.canvas.getSelectionContext();
        this.aligningLineOffset = 5;
        this.aligningLineMargin = 4;
        this.aligningLineWidth = 1;
        this.aligningLineColor = LINECOLOR;
        this.viewportTransform = this.handler.canvas
            .viewportTransform as number[];
        this.zoom = 1;
        this.verticalLines = [];
        this.horizontalLines = [];
    }

    /**
     * @name 销毁监听
     */
    public destroy() {
        this.handler.canvas.off({
            'before:render': this.beforeRender,
            'after:render': this.afterRender,
        });
    }

    /**
     * @name 画线
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    drawLine = (x1: number, y1: number, x2: number, y2: number) => {
        const {
            ctx,
            aligningLineWidth,
            aligningLineColor,
            viewportTransform,
            zoom,
        } = this;
        ctx.save();
        ctx.lineWidth = aligningLineWidth;
        ctx.strokeStyle = aligningLineColor;
        ctx.beginPath();
        ctx.moveTo(
            x1 * zoom + viewportTransform[4],
            y1 * zoom + viewportTransform[5],
        );
        ctx.lineTo(
            x2 * zoom + viewportTransform[4],
            y2 * zoom + viewportTransform[5],
        );
        ctx.stroke();
        ctx.restore();
    };

    /**
     * @name 垂线
     * @param coords
     */
    drawVerticalLine = (coords: { x: number; y1: number; y2: number }) => {
        if (coords) {
            this.drawLine(
                coords.x + 0.5,
                coords.y1 > coords.y2 ? coords.y2 : coords.y1,
                coords.x + 0.5,
                coords.y2 > coords.y1 ? coords.y2 : coords.y1,
            );
        }
    };

    /**
     * @name 横线
     * @param coords
     */
    drawHorizontalLine = (coords: { y: number; x1: number; x2: number }) => {
        if (coords) {
            this.drawLine(
                coords.x1 > coords.x2 ? coords.x2 : coords.x1,
                coords.y + 0.5,
                coords.x2 > coords.x1 ? coords.x2 : coords.x1,
                coords.y + 0.5,
            );
        }
    };

    /**
     * 渲染前
     *
     * @param {FabricEvent} _opt
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public beforeRender = (_opt: FabricEvent) => {
        this.handler.canvas.clearContext(this.handler.guidelineHandler.ctx);
    };

    /**
     * 渲染后
     *
     * @param {FabricEvent} _opt
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public afterRender = (_opt: FabricEvent) => {
        for (
            let i = this.handler.guidelineHandler.verticalLines.length;
            i--;

        ) {
            this.handler.guidelineHandler.drawVerticalLine(
                this.handler.guidelineHandler.verticalLines[i],
            );
        }
        for (
            let i = this.handler.guidelineHandler.horizontalLines.length;
            i--;

        ) {
            this.handler.guidelineHandler.drawHorizontalLine(
                this.handler.guidelineHandler.horizontalLines[i],
            );
        }
        this.handler.guidelineHandler.verticalLines.length = 0;
        this.handler.guidelineHandler.horizontalLines.length = 0;
    };

    /**
     * 判断是否在范围内
     * @param v1
     * @param v2
     * @returns
     */
    public isInRange = (v1: number, v2: number) => {
        const { aligningLineMargin } = this;
        // eslint-disable-next-line no-param-reassign
        v1 = Math.round(v1);
        // eslint-disable-next-line no-param-reassign
        v2 = Math.round(v2);
        for (
            let i = v1 - aligningLineMargin, len = v1 + aligningLineMargin;
            i <= len;
            i++
        ) {
            if (i === v2) {
                return true;
            }
        }
        return false;
    };

    /**
     * @name 移动时辅助线
     * @param target
     */
    public movingGuidelines = (target: FabricObject) => {
        const canvasObjects =
            this.handler.canvas.getObjects() as FabricObject[];
        const activeObjectCenter = target.getCenterPoint();
        const activeObjectLeft = activeObjectCenter.x;
        const activeObjectTop = activeObjectCenter.y;
        const activeObjectBoundingRect = target.getBoundingRect();
        const activeObjectWidth =
            activeObjectBoundingRect.width / this.viewportTransform[0];
        const activeObjectHeight =
            activeObjectBoundingRect.height / this.viewportTransform[3];
        let horizontalInTheRange = false;
        let verticalInTheRange = false;
        const { _currentTransform: transform } = this.handler.canvas as any;
        if (!transform) return;

        for (let i = canvasObjects.length; i--; ) {
            if (
                canvasObjects[i] === target ||
                canvasObjects[i].superType === 'port' ||
                canvasObjects[i].superType === 'link' ||
                !canvasObjects[i].evented
            ) {
                continue;
            }

            const objectCenter = canvasObjects[i].getCenterPoint();
            const objectLeft = objectCenter.x;
            const objectTop = objectCenter.y;
            const objectBoundingRect = canvasObjects[i].getBoundingRect();
            const objectWidth =
                objectBoundingRect.width / this.viewportTransform[0];
            const objectHeight =
                objectBoundingRect.height / this.viewportTransform[3];

            // 按水平中心线捕获
            if (this.isInRange(objectLeft, activeObjectLeft)) {
                verticalInTheRange = true;
                if (canvasObjects[i].id === 'workarea') {
                    const y1 = -5000;
                    const y2 = 5000;
                    this.verticalLines.push({
                        x: objectLeft,
                        y1,
                        y2,
                    });
                } else {
                    this.verticalLines.push({
                        x: objectLeft,
                        y1:
                            objectTop < activeObjectTop
                                ? objectTop -
                                  objectHeight / 2 -
                                  this.aligningLineOffset
                                : objectTop +
                                  objectHeight / 2 +
                                  this.aligningLineOffset,
                        y2:
                            activeObjectTop > objectTop
                                ? activeObjectTop +
                                  activeObjectHeight / 2 +
                                  this.aligningLineOffset
                                : activeObjectTop -
                                  activeObjectHeight / 2 -
                                  this.aligningLineOffset,
                    });
                }
                target.setPositionByOrigin(
                    new fabric.Point(objectLeft, activeObjectTop),
                    'center',
                    'center',
                );
            }

            // 左边对齐捕获
            if (
                this.isInRange(
                    objectLeft - objectWidth / 2,
                    activeObjectLeft - activeObjectWidth / 2,
                )
            ) {
                verticalInTheRange = true;
                if (canvasObjects[i].id === 'workarea') {
                    const workarea = canvasObjects[i] as WorkareaObject;
                    const y1 = -5000;
                    const y2 = 5000;
                    let x = objectLeft - objectWidth / 2;
                    if (workarea.layout === 'fullscreen') {
                        x = 0;
                    }
                    this.verticalLines.push({
                        x,
                        y1,
                        y2,
                    });
                } else {
                    this.verticalLines.push({
                        x: objectLeft - objectWidth / 2,
                        y1:
                            objectTop < activeObjectTop
                                ? objectTop -
                                  objectHeight / 2 -
                                  this.aligningLineOffset
                                : objectTop +
                                  objectHeight / 2 +
                                  this.aligningLineOffset,
                        y2:
                            activeObjectTop > objectTop
                                ? activeObjectTop +
                                  activeObjectHeight / 2 +
                                  this.aligningLineOffset
                                : activeObjectTop -
                                  activeObjectHeight / 2 -
                                  this.aligningLineOffset,
                    });
                }
                target.setPositionByOrigin(
                    new fabric.Point(
                        objectLeft - objectWidth / 2 + activeObjectWidth / 2,
                        activeObjectTop,
                    ),
                    'center',
                    'center',
                );
            }

            // 右边对齐捕获
            if (
                this.isInRange(
                    objectLeft + objectWidth / 2,
                    activeObjectLeft + activeObjectWidth / 2,
                )
            ) {
                verticalInTheRange = true;
                if (canvasObjects[i].id === 'workarea') {
                    const workarea = canvasObjects[i] as WorkareaObject;
                    const y1 = -5000;
                    const y2 = 5000;
                    let x = objectLeft + objectWidth / 2;
                    if (workarea.layout === 'fullscreen') {
                        x = this.handler.canvas.getWidth();
                    }
                    this.verticalLines.push({
                        x,
                        y1,
                        y2,
                    });
                } else {
                    this.verticalLines.push({
                        x: objectLeft + objectWidth / 2,
                        y1:
                            objectTop < activeObjectTop
                                ? objectTop -
                                  objectHeight / 2 -
                                  this.aligningLineOffset
                                : objectTop +
                                  objectHeight / 2 +
                                  this.aligningLineOffset,
                        y2:
                            activeObjectTop > objectTop
                                ? activeObjectTop +
                                  activeObjectHeight / 2 +
                                  this.aligningLineOffset
                                : activeObjectTop -
                                  activeObjectHeight / 2 -
                                  this.aligningLineOffset,
                    });
                }
                target.setPositionByOrigin(
                    new fabric.Point(
                        objectLeft + objectWidth / 2 - activeObjectWidth / 2,
                        activeObjectTop,
                    ),
                    'center',
                    'center',
                );
            }

            // 垂直中心线捕获
            if (this.isInRange(objectTop, activeObjectTop)) {
                horizontalInTheRange = true;
                if (canvasObjects[i].id === 'workarea') {
                    const x1 = -5000;
                    const x2 = 5000;
                    this.horizontalLines.push({
                        y: objectTop,
                        x1,
                        x2,
                    });
                } else {
                    this.horizontalLines.push({
                        y: objectTop,
                        x1:
                            objectLeft < activeObjectLeft
                                ? objectLeft -
                                  objectWidth / 2 -
                                  this.aligningLineOffset
                                : objectLeft +
                                  objectWidth / 2 +
                                  this.aligningLineOffset,
                        x2:
                            activeObjectLeft > objectLeft
                                ? activeObjectLeft +
                                  activeObjectWidth / 2 +
                                  this.aligningLineOffset
                                : activeObjectLeft -
                                  activeObjectWidth / 2 -
                                  this.aligningLineOffset,
                    });
                }
                target.setPositionByOrigin(
                    new fabric.Point(activeObjectLeft, objectTop),
                    'center',
                    'center',
                );
            }

            // 顶部对齐捕获
            if (
                this.isInRange(
                    objectTop - objectHeight / 2,
                    activeObjectTop - activeObjectHeight / 2,
                )
            ) {
                horizontalInTheRange = true;
                if (canvasObjects[i].id === 'workarea') {
                    const workarea = canvasObjects[i] as WorkareaObject;
                    const x1 = -5000;
                    const x2 = 5000;
                    let y = objectTop - objectHeight / 2;
                    if (workarea.layout === 'fullscreen') {
                        y = 0;
                    }
                    this.horizontalLines.push({
                        y,
                        x1,
                        x2,
                    });
                } else {
                    this.horizontalLines.push({
                        y: objectTop - objectHeight / 2,
                        x1:
                            objectLeft < activeObjectLeft
                                ? objectLeft -
                                  objectWidth / 2 -
                                  this.aligningLineOffset
                                : objectLeft +
                                  objectWidth / 2 +
                                  this.aligningLineOffset,
                        x2:
                            activeObjectLeft > objectLeft
                                ? activeObjectLeft +
                                  activeObjectWidth / 2 +
                                  this.aligningLineOffset
                                : activeObjectLeft -
                                  activeObjectWidth / 2 -
                                  this.aligningLineOffset,
                    });
                }
                target.setPositionByOrigin(
                    new fabric.Point(
                        activeObjectLeft,
                        objectTop - objectHeight / 2 + activeObjectHeight / 2,
                    ),
                    'center',
                    'center',
                );
            }

            // 底部对齐捕获
            if (
                this.isInRange(
                    objectTop + objectHeight / 2,
                    activeObjectTop + activeObjectHeight / 2,
                )
            ) {
                horizontalInTheRange = true;
                if (canvasObjects[i].id === 'workarea') {
                    const workarea = canvasObjects[i] as WorkareaObject;
                    const x1 = -5000;
                    const x2 = 5000;
                    let y = objectTop + objectHeight / 2;
                    if (workarea.layout === 'fullscreen') {
                        y = this.handler.canvas.getHeight();
                    }
                    this.horizontalLines.push({
                        y,
                        x1,
                        x2,
                    });
                } else {
                    this.horizontalLines.push({
                        y: objectTop + objectHeight / 2,
                        x1:
                            objectLeft < activeObjectLeft
                                ? objectLeft -
                                  objectWidth / 2 -
                                  this.aligningLineOffset
                                : objectLeft +
                                  objectWidth / 2 +
                                  this.aligningLineOffset,
                        x2:
                            activeObjectLeft > objectLeft
                                ? activeObjectLeft +
                                  activeObjectWidth / 2 +
                                  this.aligningLineOffset
                                : activeObjectLeft -
                                  activeObjectWidth / 2 -
                                  this.aligningLineOffset,
                    });
                }
                target.setPositionByOrigin(
                    new fabric.Point(
                        activeObjectLeft,
                        objectTop + objectHeight / 2 - activeObjectHeight / 2,
                    ),
                    'center',
                    'center',
                );
            }
        }

        if (!horizontalInTheRange) {
            this.horizontalLines.length = 0;
        }

        if (!verticalInTheRange) {
            this.verticalLines.length = 0;
        }
    };
}

export default GuidelineHandler;
