import { fabric } from 'fabric';
import middleIcon from '@/assets/canvas/middlecontrol.svg';
import middlehozIcon from '@/assets/canvas/middlecontrolhoz.svg';
import edgeIcon from '@/assets/canvas/edgecontrol.svg';
import rotateIcon from '@/assets/canvas/rotate.png';

const initControls = () => {
    // 各种大小精度
    fabric.Object.NUM_FRACTION_DIGITS = 8;

    fabric.Canvas.prototype.selectionColor = 'rgba(40, 144, 149, 0.269)';
    fabric.Canvas.prototype.selectionBorderColor = 'rgb(69, 211, 174)'; //'#209fa5';
    fabric.Canvas.prototype.selectionLineWidth = 1;

    let imgmlr = document.createElement('img');
    imgmlr.src = middleIcon;

    let imgmtb = document.createElement('img');
    imgmtb.src = middlehozIcon;

    let imgedge = document.createElement('img');
    imgedge.src = edgeIcon;

    let imgrot = document.createElement('img');
    imgrot.src = rotateIcon;

    function renderIcon(
        ctx: CanvasRenderingContext2D,
        left: number,
        top: number,
        styleOverride: any,
        fabricObject: fabric.Object,
    ) {
        const wsize = 20;
        const hsize = 25;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject?.angle || 0));
        ctx.drawImage(imgmlr, -wsize / 2, -hsize / 2, wsize, hsize);
        ctx.restore();
    }

    function renderIconRotate(
        ctx: CanvasRenderingContext2D,
        left: number,
        top: number,
        styleOverride: any,
        fabricObject: fabric.Object,
    ) {
        const wsize = 40;
        const hsize = 40;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject?.angle || 0));
        ctx.drawImage(imgrot, -wsize / 2, -hsize / 2, wsize, hsize);
        ctx.restore();
    }

    function renderIconHoz(
        ctx: CanvasRenderingContext2D,
        left: number,
        top: number,
        styleOverride: any,
        fabricObject: fabric.Object,
    ) {
        const wsize = 25;
        const hsize = 20;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject?.angle || 0));
        ctx.drawImage(imgmtb, -wsize / 2, -hsize / 2, wsize, hsize);
        ctx.restore();
    }

    function renderIconEdge(
        ctx: CanvasRenderingContext2D,
        left: number,
        top: number,
        styleOverride: any,
        fabricObject: fabric.Object,
    ) {
        const wsize = 25;
        const hsize = 25;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject?.angle || 0));
        ctx.drawImage(imgedge, -wsize / 2, -hsize / 2, wsize, hsize);
        ctx.restore();
    }

    fabric.Object.prototype.padding = 1;
    fabric.Object.prototype.controls.mtr.withConnection = false;
    fabric.Object.prototype.borderScaleFactor = 2.5;
    fabric.Object.prototype.borderOpacityWhenMoving = 1;
    fabric.Object.prototype.borderColor = 'rgb(69, 211, 174)'; //'#209fa5';
    // 修改控制点的形状，默认为`rect`矩形，可选的值还有`circle`圆形
    fabric.Object.prototype.cornerStyle = 'circle';
    // 修改控制点的填充色为白色
    fabric.Object.prototype.cornerColor = 'white';
    // 设置控制点不透明，即可以盖住其下的控制线
    fabric.Object.prototype.transparentCorners = false;
    // 修改控制点的边框颜色为`gray`灰色
    fabric.Object.prototype.cornerStrokeColor = 'gray';

    // 单独修改旋转控制点距离主体的纵向距离为-20px
    // fabric.Object.prototype.controls.mtr.offsetY = -30;

    fabric.Object.prototype.controls.ml = new fabric.Control({
        x: -0.5,
        y: 0,
        offsetX: -1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIcon,
    });

    fabric.Object.prototype.controls.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        offsetX: 1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIcon,
    });

    fabric.Object.prototype.controls.mb = new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIconHoz,
    });

    fabric.Object.prototype.controls.mt = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetY: -1,
        cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
        getActionName: fabric.controlsUtils.scaleOrSkewActionName,
        render: renderIconHoz,
    });

    fabric.Object.prototype.controls.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
    });

    fabric.Object.prototype.controls.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
    });

    fabric.Object.prototype.controls.bl = new fabric.Control({
        x: -0.5,
        y: 0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
    });

    fabric.Object.prototype.controls.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: renderIconEdge,
    });

    fabric.Object.prototype.controls.mtr = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetY: -30,
        actionName: 'rotate',
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
        render: renderIconRotate,
    });

    if (fabric.Textbox) {
        let textBoxControls = fabric.Textbox.prototype.controls;
        textBoxControls.mtr = fabric.Object.prototype.controls.mtr;
        textBoxControls.tr = fabric.Object.prototype.controls.tr;
        textBoxControls.br = fabric.Object.prototype.controls.br;
        textBoxControls.tl = fabric.Object.prototype.controls.tl;
        textBoxControls.bl = fabric.Object.prototype.controls.bl;
        textBoxControls.mt = fabric.Object.prototype.controls.mt;
        textBoxControls.mb = fabric.Object.prototype.controls.mb;

        textBoxControls.ml = new fabric.Control({
            x: -0.5,
            y: 0,
            offsetX: -1,
            cursorStyleHandler:
                fabric.controlsUtils.scaleSkewCursorStyleHandler,
            actionHandler: fabric.controlsUtils.changeWidth,
            actionName: 'resizing',
            render: renderIcon,
        });

        textBoxControls.mr = new fabric.Control({
            x: 0.5,
            y: 0,
            offsetX: 1,
            cursorStyleHandler:
                fabric.controlsUtils.scaleSkewCursorStyleHandler,
            actionHandler: fabric.controlsUtils.changeWidth,
            actionName: 'resizing',
            render: renderIcon,
        });
    }
};

export default initControls;
