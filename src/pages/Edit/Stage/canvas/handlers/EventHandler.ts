import { fabric } from 'fabric';
import anime from 'animejs';
import { Handler } from '.';
import {
    FabricObjectType,
    InteractionModeType,
    WorkareaLayoutType,
} from '../const/defaults';
import { code } from '../const';

/**
 * @description 画布事件
 */
class EventHandler {
    handler: Handler;
    code: string | undefined;
    panning: boolean | undefined;

    constructor(handler: Handler) {
        this.handler = handler;
        this.init();
    }

    public init() {
        if (this.handler?.editable) {
            // @ts-ignore
            this.handler.canvas.on({
                'object:modified': this.modified,
                'object:scaling': this.scaling,
                'object:scaled': this.scaled,
                'object:moving': this.moving,
                'object:moved': this.moved,
                'object:rotating': this.rotating,
                'object:rotated': this.rotated,
                'mouse:dblclick': this.dbclick,
                'mouse:wheel': this.mousewheel,
                'mouse:down': this.mousedown,
                'mouse:move': this.mousemove,
                'mouse:up': this.mouseup,
                'selection:cleared': this.selection,
                'selection:created': this.selection,
                'selection:updated': this.selection,
            });
        } else {
            // @ts-ignore
            this.handler.canvas.on({
                'mouse:dblclick': this.dbclick,
                'mouse:wheel': this.mousewheel,
                'mouse:down': this.mousedown,
                'mouse:move': this.mousemove,
                'moudr:out': this.mouseout,
                'mouse:up': this.mouseup,
            });
        }
        if (this.handler.canvas.wrapperEl) {
            // this.handler.canvas.wrapperEl.tabIndex = 1000;
            this.handler.canvas.wrapperEl.addEventListener(
                'keydown',
                this.keydown,
                false,
            );
            this.handler.canvas.wrapperEl.addEventListener(
                'keyup',
                this.keyup,
                false,
            );
            this.handler.canvas.wrapperEl.addEventListener(
                'mousedown',
                this.onMouseDown,
                false,
            );
            this.handler.canvas.wrapperEl.addEventListener(
                'contextmenu',
                this.contextMenu,
                false,
            );
        }
        if (this.handler.keyEvent.clipboard) {
            document.addEventListener('paste', this.paste, false);
        }
    }

    /**
     * @name 销毁所有事件
     */
    public destroy = () => {
        if (this.handler?.editable) {
            this.handler.canvas.off({
                'object:modified': this.modified,
                'object:scaling': this.scaling,
                'object:scaled': this.scaled,
                'object:moving': this.moving,
                'object:moved': this.moved,
                'object:rotating': this.rotating,
                'object:rotated': this.rotated,
                'mouse:dblclick': this.dbclick,
                'mouse:wheel': this.mousewheel,
                'mouse:down': this.mousedown,
                'mouse:move': this.mousemove,
                'mouse:up': this.mouseup,
                'selection:cleared': this.selection,
                'selection:created': this.selection,
                'selection:updated': this.selection,
            });
        } else {
            this.handler.canvas.off({
                'mouse:dblclick': this.dbclick,
                'mouse:down': this.mousedown,
                'mouse:move': this.mousemove,
                'mouse:out': this.mouseout,
                'mouse:up': this.mouseup,
                'mouse:wheel': this.mousewheel,
            });
            this.handler.getObjects().forEach((object) => {
                object.off(
                    'mousedown',
                    this.handler.eventHandler.object.mousedown,
                );
                if (object.anime) {
                    anime.remove(object);
                }
            });
        }

        if (this.handler.canvas.wrapperEl) {
            this.handler.canvas.wrapperEl.tabIndex = 1000;
            this.handler.canvas.wrapperEl.removeEventListener(
                'keydown',
                this.keydown,
            );
            this.handler.canvas.wrapperEl.removeEventListener(
                'keyup',
                this.keyup,
            );
            this.handler.canvas.wrapperEl.removeEventListener(
                'mousedown',
                this.onMouseDown,
            );
            this.handler.canvas.wrapperEl.removeEventListener(
                'contextmenu',
                this.contextMenu,
            );
        }
        if (this.handler.keyEvent.clipboard) {
            document.removeEventListener('paste', this.paste);
        }
    };

    /**
     * @name 单个对象事件
     */
    public object = {
        /**
         * 鼠标按下事件
         * @param {FabricEvent} opt
         */
        mousedown: (opt: FabricEvent) => {
            const { target } = opt;
            if (target && target.link && target.link.enabled) {
                const { onClick } = this.handler;
                if (onClick) {
                    onClick(this.handler.canvas, target);
                }
            }
        },
        /**
         * 双击事件
         * @param {FabricEvent} opt
         */
        mousedblclick: (opt: FabricEvent) => {
            const { target } = opt;
            if (target) {
                const { onDblClick } = this.handler;
                if (onDblClick) {
                    onDblClick(this.handler.canvas, target);
                }
            }
        },
    };

    /**
     * @name 画布大小调节
     * @param nextWidth
     * @param nextHeight
     * @returns
     */
    public resize = (nextWidth: number, nextHeight: number) => {
        if (!this.handler.canvas) return;
        this.handler.contextmenuHandler.hide();
        this.handler.canvas.setWidth(nextWidth).setHeight(nextHeight);
        if (!this.handler.workarea) {
            return;
        }
        if (!this.handler.width || !this.handler.height) return;
        const diffWidth = nextWidth / 2 - this.handler.width / 2;
        const diffHeight = nextHeight / 2 - this.handler.height / 2;
        // 有问题要改
        // if (diffWidth !== 0) {
        //     this.handler.zoomHandler.zoomToNumber(1);
        // }
        this.handler.width = nextWidth;
        this.handler.height = nextHeight;

        if (this.handler.workarea!.layout === WorkareaLayoutType.FIXED) {
            this.handler.canvas.centerObject(this.handler.workarea!);
            this.handler.canvas.centerObject(
                this.handler.workareaHandler.bgarea!,
            );
            this.handler.workarea!.setCoords();
            this.handler.workareaHandler.bgarea!.setCoords();
            this.handler.canvas.getObjects().forEach((obj: FabricObject) => {
                if (obj?.id !== 'workarea' && obj.left && obj.top) {
                    const left = obj?.left + diffWidth;
                    const top = obj?.top + diffHeight;
                    obj.set({
                        left,
                        top,
                    });
                    obj.setCoords();
                }
            });
            this.handler.canvas.requestRenderAll();
            return;
        }
    };

    /**
     * @name 更新object事件
     * @param opt
     * @returns
     */
    public modified = (opt: FabricEvent) => {
        const { target } = opt;
        if (!target) return;
        if (target.type === 'circle' && target.parentId) return;
        if (!this.handler.transactionHandler.active) {
            this.handler.transactionHandler.save('add');
        }
        const onModified = this.handler?.onModified;
        if (onModified) {
            onModified(target);
        }
    };

    /**
     * @name 缩放对象时
     * @param opt
     */
    public scaling = (opt: FabricEvent) => {
        const { target } = opt as any;
        // TODO...this.handler.guidelineHandler.scalingGuidelines(target);
        if (target?.superType === 'element') {
            const { id } = target;
            const el = this.handler.elementHandler.findById(id);

            this.handler.elementHandler.setScaleOrAngle(el, target);
            this.handler.elementHandler.setSize(el, target);
            this.handler.elementHandler.setPosition(el, target);
        }
        // console.log('target', target)
        // if(target?.type === FabricObjectType.TEXTBOX) {
        //     let newFontSize = Math.round(target.fontSize * (target.scaleY + target.scaleX));
        //     target.set('fontSize', newFontSize > 12 ? newFontSize : 12);
        //     target.scaleX = 1;
        //     target.scaleY = 1;
        // }
    };

    /**
     * @name 缩放后
     * @param _opt
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public scaled = (_opt: FabricEvent) => {
        if (!this.handler.transactionHandler.active) {
            this.handler.transactionHandler.save('scaled');
        }
    };

    /**
     * @name 移动对象时
     * @param opt
     */
    public moving = (opt: FabricEvent) => {
        const { target } = opt;
        if (!target) return;

        if (this.handler?.editable && this.handler?.guidelineOption?.enabled) {
            this.handler.guidelineHandler.movingGuidelines(target);
        }
    };

    /**
     * @name 移动之后
     * @param _opt
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public moved = (_opt: FabricEvent) => {
        console.error('>>>>>');
        if (!this.handler.transactionHandler.active) {
            this.handler.transactionHandler.save('moved');
        }
    };

    /**
     * @name 旋转中
     * @param opt
     */
    public rotating = (opt: FabricEvent) => {
        const { target } = opt as any;
        // todo element的操作
    };

    /**
     * @name 旋转后
     * @param opt
     */
    public rotated = (opt: FabricEvent) => {
        if (!this.handler.transactionHandler.active) {
            this.handler.transactionHandler.save('rotated');
        }
    };

    /**
     * @name 鼠标滚轮放大缩小
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

    /**
     * @name 双击事件
     * @param opt
     */
    public dbclick = (opt: FabricEvent) => {
        const event = opt as FabricEvent<MouseEvent>;
        const editable = this.handler?.editable;

        if (editable) {
            // todo 组内双击选中对象这个应该单独提一个自定义对象去实现
            if (
                event.target instanceof fabric.Group &&
                event?.subTargets?.length
            ) {
                let groupObj = event.target as fabric.Group;
                let subTargets = event?.subTargets[0] as fabric.Textbox;
                if (!groupObj && !subTargets) return;
                // 更新组内元素宽高，防止调节大小后组内元素没更新
                groupObj.addWithUpdate();

                subTargets.clone((tempText: fabric.Textbox) => {
                    tempText.left =
                        groupObj.left! + tempText.left! + groupObj.width! / 2;
                    tempText.top =
                        groupObj.top! + tempText.top! + groupObj.height! / 2;
                    // tempText.width = groupObj.width;
                    tempText.hoverCursor = 'text';

                    tempText.on('editing:exited', () => {
                        tempText.initDimensions();
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        let { left, top, ...other } = tempText;
                        subTargets.set({
                            ...other,
                            visible: true,
                        });
                        subTargets.initDimensions();
                        groupObj.addWithUpdate();
                        this.handler.canvas.remove(tempText);
                        this.handler.canvas.renderAll();
                    });

                    subTargets.set({
                        visible: false,
                    });

                    this.handler.canvas.add(tempText);
                    this.handler.canvas.setActiveObject(tempText);
                    tempText.selectAll();
                    tempText.enterEditing();
                });
            }
        }
    };

    /**
     * @name 鼠标按下
     * @param opt
     * @returns
     */
    public mousedown = (opt: FabricEvent) => {
        const event = opt as FabricEvent<MouseEvent>;
        const editable = this.handler?.editable;
        if (
            event.e.altKey &&
            editable &&
            !this.handler.interactionHandler.isDrawingMode()
        ) {
            this.handler.interactionHandler.grab();
            this.panning = true;
            return;
        }
        if (this.handler?.interactionMode === InteractionModeType.GRAB) {
            this.panning = true;
            return;
        }

        // 获取最新辅助线位置
        if (editable) {
            this.handler.guidelineHandler.viewportTransform =
                this.handler.canvas.viewportTransform!;
            this.handler.guidelineHandler.zoom = this.handler.canvas.getZoom();
        }
    };

    /**
     * @name 鼠标移动
     * @param opt
     */
    public mousemove = (opt: FabricEvent) => {
        const event = opt as FabricEvent<MouseEvent>;
        const editable = this.handler?.editable;
        if (
            this.handler?.interactionMode === InteractionModeType.GRAB &&
            this.panning
        ) {
            this.handler.interactionHandler.moving(event.e);
            this.handler.canvas.requestRenderAll();
        }
    };

    /**
     * @name 鼠标松开
     * @param opt
     * @returns
     */
    public mouseup = (opt: FabricEvent) => {
        const event = opt as FabricEvent<MouseEvent>;
        const editable = this.handler?.editable;
        if (this.handler?.interactionMode === 'grab') {
            this.panning = false;
            return;
        }
        // 重置
        if (this.handler?.editable && this.handler.guidelineOption?.enabled) {
            this.handler.guidelineHandler.verticalLines.length = 0;
            this.handler.guidelineHandler.horizontalLines.length = 0;
        }
        this.handler?.canvas?.renderAll();
    };

    /**
     * 鼠标hover离开
     * @param opt
     */
    public mouseout = (opt: FabricEvent) => {
        const event = opt as FabricEvent<MouseEvent>;
    };

    /**
     * @name 选中时
     * @param opt
     */
    public selection = (opt: FabricEvent) => {
        const { onSelect, activeSelectionOption } = this.handler;
        const selected = opt?.selected;
        const target = opt.target as FabricObject<fabric.ActiveSelection>;
        // const activeObject = this.handler.canvas.getActiveObject();
        // console.log('activeObject', activeObject);
        // console.log('selected', selected);
        // console.log('target', target);
        if (target && target?.type === 'activeSelection') {
            target.set({
                ...activeSelectionOption,
            });
        }
        if (onSelect) {
            onSelect(selected);
        }
    };

    /**
     * @name 方向键按下时移动对象
     * @param e
     * @returns
     */
    public arrowmoving = (e: KeyboardEvent) => {
        const activeObject =
            this.handler.canvas.getActiveObject() as FabricObject;
        if (!activeObject) {
            return false;
        }
        if (activeObject.id === 'workarea') {
            return false;
        }
        if (!activeObject.top || !activeObject.left) return;
        if (e.code === code.ARROW_UP) {
            activeObject.set('top', activeObject.top - 2);
            activeObject.setCoords();
            this.handler.canvas.renderAll();
            return true;
        } else if (e.code === code.ARROW_DOWN) {
            activeObject.set('top', activeObject.top + 2);
            activeObject.setCoords();
            this.handler.canvas.renderAll();
            return true;
        } else if (e.code === code.ARROW_LEFT) {
            activeObject.set('left', activeObject.left - 2);
            activeObject.setCoords();
            this.handler.canvas.renderAll();
            return true;
        } else if (e.code === code.ARROW_RIGHT) {
            activeObject.set('left', activeObject.left + 2);
            activeObject.setCoords();
            this.handler.canvas.renderAll();
            return true;
        }
        if (this.handler.onModified) {
            this.handler.onModified(activeObject);
        }
        return true;
    };

    /**
     * @name 按键按下
     * @param e
     */
    public keydown = (e: KeyboardEvent) => {
        const { keyEvent, editable } = this.handler;
        e.preventDefault();
        if (!Object.keys(keyEvent).length) {
            return;
        }
        const { clipboard, grab } = keyEvent;
        if (this.handler.shortcutHandler.isW(e) && grab) {
            this.code = e.code;
            this.handler.interactionHandler.grab();
            return;
        }
        if (e.altKey && editable && grab) {
            this.handler.interactionHandler.grab();
            return;
        }
        if (this.handler.shortcutHandler.isEscape(e)) {
            if (this.handler.interactionMode === 'selection') {
                this.handler.canvas.discardActiveObject();
                this.handler.canvas.renderAll();
            }
            // this.handler.tooltipHandler.hide();
        }
        if (this.handler.canvas.wrapperEl !== document.activeElement) {
            return;
        }

        if (editable) {
            if (this.handler.shortcutHandler.isQ(e)) {
                this.code = e.code;
            } else if (this.handler.shortcutHandler.isDelete(e)) {
                this.handler.remove();
            } else if (this.handler.shortcutHandler.isArrow(e)) {
                this.arrowmoving(e);
            } else if (this.handler.shortcutHandler.isCtrlA(e)) {
                e.preventDefault();
                this.handler.selectAll();
            } else if (this.handler.shortcutHandler.isCtrlC(e)) {
                e.preventDefault();
                this.handler.copy();
            } else if (this.handler.shortcutHandler.isCtrlV(e) && !clipboard) {
                e.preventDefault();
                this.handler.paste();
            } else if (this.handler.shortcutHandler.isCtrlX(e)) {
                e.preventDefault();
                this.handler.cut();
            } else if (this.handler.shortcutHandler.isCtrlZ(e)) {
                e.preventDefault();
                this.handler.transactionHandler.undo();
            } else if (this.handler.shortcutHandler.isCtrlY(e)) {
                e.preventDefault();
                this.handler.transactionHandler.redo();
            } else if (this.handler.shortcutHandler.isPlus(e)) {
                e.preventDefault();
                this.handler.zoomHandler.zoomIn();
            } else if (this.handler.shortcutHandler.isMinus(e)) {
                e.preventDefault();
                this.handler.zoomHandler.zoomOut();
            } else if (this.handler.shortcutHandler.isO(e)) {
                e.preventDefault();
                this.handler.zoomHandler.zoomOneToOne();
            } else if (this.handler.shortcutHandler.isP(e)) {
                e.preventDefault();
                this.handler.zoomHandler.zoomToFit();
            }
            return;
        }
    };

    /**
     * @name 按键放开
     * @param e
     */
    public keyup = (e: KeyboardEvent) => {
        e.preventDefault();
        if (this.handler.interactionHandler.isDrawingMode()) {
            return;
        }
        if (!this.handler.shortcutHandler.isW(e)) {
            this.handler.interactionHandler.selection();
        }
    };

    /**
     * @name 鼠标在画布上按下时
     * @param _e
     */
    public onMouseDown = (_e: MouseEvent) => {
        this.handler.contextmenuHandler.hide(_e);
    };

    /**
     * @name 右键上下文菜单
     * @param e
     */
    public contextMenu = (e: MouseEvent) => {
        e.preventDefault();
        const editable = this.handler?.editable;
        const onContext = this.handler?.onContext;
        if (editable && onContext) {
            const target = this.handler.canvas.findTarget(
                e,
                false,
            ) as FabricObject;
            if (target && target?.type !== 'activeSelection') {
                if (target?.id !== 'workarea') {
                    this.handler.select(target);
                    this.handler.contextmenuHandler.show(e, target);
                } else {
                    this.handler.contextmenuHandler.show(e);
                }
            }
        }
    };

    /**
     * @name 粘贴
     * @param e
     * @returns
     */
    public paste = (e: ClipboardEvent) => {
        if (this.handler.canvas.wrapperEl !== document.activeElement) {
            return false;
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        const clipboardData = e.clipboardData;
        if (clipboardData?.types?.length) {
            clipboardData.types.forEach(async (clipboardType: string) => {
                if (clipboardType === 'text/plain') {
                    const textPlain = clipboardData.getData('text/plain');
                    try {
                        const objects = JSON.parse(textPlain);
                        const {
                            gridOption: { grid = 10 },
                            isCut,
                        } = this.handler;
                        const padding = isCut ? 0 : grid;
                        if (objects && Array.isArray(objects)) {
                            const filteredObjects = objects.filter(
                                (obj) => obj !== null,
                            );
                            if (filteredObjects.length === 1) {
                                const obj = filteredObjects[0];
                                if (
                                    typeof obj.cloneable !== 'undefined' &&
                                    !obj.cloneable
                                ) {
                                    return;
                                }
                                obj.left = obj.properties.left + padding;
                                obj.top = obj.properties.top + padding;
                                const createdObj = await this.handler.add(
                                    obj,
                                    false,
                                );
                                if (createdObj) {
                                    this.handler.canvas.setActiveObject(
                                        createdObj as FabricObject,
                                    );
                                }
                                this.handler.canvas.requestRenderAll();
                            } else {
                                const nodes = [] as any[];
                                const targets = [] as any[];
                                objects.forEach((obj) => {
                                    if (!obj) {
                                        return;
                                    }
                                    obj.left = obj.properties.left + padding;
                                    obj.top = obj.properties.top + padding;

                                    const createdObj = this.handler.add(
                                        obj,
                                        false,
                                    );
                                    targets.push(createdObj);
                                });
                                const activeSelection =
                                    new fabric.ActiveSelection(
                                        nodes.length ? nodes : targets,
                                        {
                                            canvas: this.handler.canvas,
                                            ...this.handler
                                                .activeSelectionOption,
                                        },
                                    );
                                this.handler.canvas.setActiveObject(
                                    activeSelection,
                                );
                                this.handler.canvas.requestRenderAll();
                            }
                            if (!this.handler.transactionHandler.active) {
                                this.handler.transactionHandler.save('paste');
                            }
                            this.handler.isCut = false;
                            this.handler.copy();
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        }
        return true;
    };
}

export default EventHandler;
