import * as PIXI from 'pixi.js';
import rotate_icon from '@/assets/rot_icon_mod.png';
const circleWidth = 16;
const LINEWIDTH = 6;
const MINSIZE = 30;
const MIN_DIS = 15; // 预览辅助线最小吸附距离

PIXI.Graphics.prototype.drawDashLine = function (toX, toY, dash = 16, gap = 8) {
  const lastPosition = this.currentPath.points;

  const currentPosition = {
    x: lastPosition[lastPosition.length - 2] || 0,
    y: lastPosition[lastPosition.length - 1] || 0,
  };

  const absValues = {
    toX: Math.abs(toX),
    toY: Math.abs(toY),
  };

  for (
    ;
    Math.abs(currentPosition.x) < absValues.toX ||
    Math.abs(currentPosition.y) < absValues.toY;

  ) {
    currentPosition.x =
      Math.abs(currentPosition.x + dash) < absValues.toX
        ? currentPosition.x + dash
        : toX;
    currentPosition.y =
      Math.abs(currentPosition.y + dash) < absValues.toY
        ? currentPosition.y + dash
        : toY;

    this.lineTo(currentPosition.x, currentPosition.y);

    currentPosition.x =
      Math.abs(currentPosition.x + gap) < absValues.toX
        ? currentPosition.x + gap
        : toX;
    currentPosition.y =
      Math.abs(currentPosition.y + gap) < absValues.toY
        ? currentPosition.y + gap
        : toY;

    this.moveTo(currentPosition.x, currentPosition.y);
  }
};

function computGuides(oldpos, w, h) {
  let pos = {
    left: oldpos.left - w / 2,
    top: oldpos.top - h / 2,
  };

  return [
    {
      type: 'h',
      left: pos.left,
      top: pos.top,
    },
    {
      type: 'h',
      left: pos.left,
      top: pos.top + h,
    },
    {
      type: 'v',
      left: pos.left,
      top: pos.top,
    },
    {
      type: 'v',
      left: pos.left + w,
      top: pos.top,
    },
    {
      type: 'h',
      left: pos.left,
      top: pos.top + h / 2,
    },
    {
      type: 'v',
      left: pos.left + w / 2,
      top: pos.top,
    },
  ];
}

// 建矩形触摸快
export const drawRect = (sizeContainer, content, callback) => {
  let mouseOffsetX, mouseOffsetY;
  const graphics = new PIXI.Graphics();
  // graphics.lineStyle(LINEWIDTH, 0xFFFFFF, 1, 1);

  graphics.beginFill(0x00c07e, 0.0000001);
  graphics.drawRect(
    content.x,
    content.y,
    content.width + 1,
    content.height + 1,
  );
  graphics.endFill();
  const texture = window.app.renderer.generateTexture(graphics);
  let sprite = new PIXI.Sprite();
  sprite.type = 'dragRect';
  sprite.zIndex = 100000;
  sprite.texture = texture;
  sprite.x = content.x;
  sprite.y = content.y;
  sprite.anchor.set(0.5);
  sprite.rotation = content.rotation || 0;
  sprite.interactive = true;
  sizeContainer.addChild(sprite);
  sprite.on('mousedown', (event) => {
    rectMouseDown(sprite, event);
  });
  sprite.on('mousemove', (event) => {
    rectMouseMove(sprite, event);
  });
  sprite.on('mouseup', (event) => {
    rectMouseUp(sprite, event);
  });
  sprite.on('mouseupoutside', (event) => {
    rectMouseUp(sprite, event);
  });

  // 画四条线
  let borderArr = [
    {
      posId: 'top',
      pivotX: content.width / 2,
      pivotY: content.height / 2,
      lineX: content.width,
      lineY: 0,
    },
    {
      posId: 'right',
      pivotX: -content.width / 2,
      pivotY: content.height / 2,
      lineX: 0,
      lineY: content.height,
    },
    {
      posId: 'bottom',
      pivotX: content.width / 2,
      pivotY: -content.height / 2,
      lineX: content.width,
      lineY: 0,
    },
    {
      posId: 'left',
      pivotX: content.width / 2,
      pivotY: content.height / 2,
      lineX: 0,
      lineY: content.height,
    },
  ];

  borderArr.forEach((item) => {
    const graphicsDashBorder = new PIXI.Graphics();
    graphicsDashBorder.lineStyle(LINEWIDTH, 0x00c07e, 1);
    graphicsDashBorder.moveTo(0, 0);
    // graphicsDashBorder.lineTo(item.lineX, item.lineY)
    graphicsDashBorder.drawDashLine(item.lineX, item.lineY);
    graphicsDashBorder.type = 'dashborder';
    graphicsDashBorder.posId = item.posId;
    graphicsDashBorder.visible = false;
    graphicsDashBorder.pivot.x = item.pivotX;
    graphicsDashBorder.pivot.y = item.pivotY;
    graphicsDashBorder.rotation = content.rotation || 0;
    graphicsDashBorder.x = content.x;
    graphicsDashBorder.y = content.y;
    sizeContainer.addChild(graphicsDashBorder);

    const graphicsBorder = new PIXI.Graphics();
    graphicsBorder.lineStyle(LINEWIDTH, 0x00c07e, 1);
    graphicsBorder.moveTo(0, 0);
    graphicsBorder.lineTo(item.lineX, item.lineY);
    // graphicsBorder.drawDashLine(item.lineX, item.lineY)
    graphicsBorder.type = 'border';
    graphicsBorder.posId = item.posId;
    graphicsBorder.pivot.x = item.pivotX;
    graphicsBorder.pivot.y = item.pivotY;
    graphicsBorder.rotation = content.rotation || 0;
    graphicsBorder.x = content.x;
    graphicsBorder.y = content.y;
    sizeContainer.addChild(graphicsBorder);
  });

  function rectMouseDown(circle, event) {
    circle.data = event.data;
    circle.dragging = true;
    mouseOffsetX = event.data.global.x - circle.x;
    mouseOffsetY = event.data.global.y - circle.y;
  }

  function rectMouseMove(circle, event) {
    const newPosition = circle?.data?.getLocalPosition(circle.parent);
    let stageWidth = window?.app?.renderer?.screen?.width;
    let stageHeight = window?.app?.renderer?.screen?.height;
    if (stageWidth || stageHeight) {
      if (
        event.data.global.x <= 0 ||
        event.data.global.x >= stageWidth ||
        event.data.global.y <= 0 ||
        event.data.global.y >= stageHeight
      ) {
        return false;
      }
    }
    if (newPosition) {
      let mousePos = {
        left: newPosition.x - mouseOffsetX,
        top: newPosition.y - mouseOffsetY,
      };
      // 改变矩形位置
      circle.x = mousePos.left;
      circle.y = mousePos.top;

      // 改变里面精灵的位置
      content.x = mousePos.left;
      content.y = mousePos.top;

      // 隐藏端点
      window.app.stage.children.forEach((container) => {
        if (container.type === 'sizeContainer') {
          container.children.forEach((itemSprite) => {
            if (itemSprite.type === 'zoomCircle') {
              itemSprite.visible = false;
            }
            if (itemSprite.type === 'border') {
              itemSprite.x = mousePos.left;
              itemSprite.y = mousePos.top;
            }
            if (itemSprite.type === 'dashborder') {
              itemSprite.x = mousePos.left;
              itemSprite.y = mousePos.top;
            }
          });
        }
      });
      // 获取当前移动距离
      let curGuides = {
        top: {
          dist: MIN_DIS + 1,
        },
        left: {
          dist: MIN_DIS + 1,
        },
      };

      let GuideWidth = window.app.renderer.width;
      let GuideHeight = window.app.renderer.height;
      // 辅助线
      const PADDIND = 40;
      const GuideHArr = [
        0,
        PADDIND,
        GuideHeight / 2,
        GuideHeight - PADDIND,
        GuideHeight,
      ];
      const GuideVArr = [
        0,
        PADDIND,
        GuideWidth / 2,
        GuideWidth - PADDIND,
        GuideWidth,
      ];

      // 所有辅助线
      const GuidesArr = [];
      GuideHArr.forEach((item, index) => {
        GuidesArr.push({
          id: `${index + 1}GUIDE_X`,
          type: 'h',
          top: item,
          left: 0,
        });
      });

      GuideVArr.forEach((item, index) => {
        GuidesArr.push({
          id: `${index + 1}GUIDE_Y`,
          type: 'v',
          top: 0,
          left: item,
        });
      });

      let spriteGuideArr = computGuides(
        mousePos,
        content.width,
        content.height,
      );
      // 查询是否有辅助线在压条吸附距离内
      GuidesArr.forEach((item, index) => {
        spriteGuideArr.forEach((spriteGuide, i) => {
          if (item.type === spriteGuide.type) {
            let prop = item.type === 'h' ? 'top' : 'left';
            let d = Math.abs(spriteGuide[prop] - item[prop]);
            if (d < curGuides[prop].dist) {
              curGuides[prop].dist = d;
              curGuides[prop].offset = spriteGuide[prop] - mousePos[prop];
              curGuides[prop].guide = item;
            }
          }
        });
      });

      // 横线
      if (curGuides.top.dist <= MIN_DIS) {
        circle.y = curGuides?.top?.guide?.top - curGuides.top.offset;
        content.y = curGuides?.top?.guide?.top - curGuides.top.offset;
        curBorder(null, curGuides?.top?.guide?.top - curGuides.top.offset);
      } else {
        circle.y = mousePos.top;
        content.y = mousePos.top;
      }

      // 竖线
      if (curGuides.left.dist <= MIN_DIS) {
        circle.x = curGuides?.left?.guide?.left - curGuides.left.offset;
        content.x = curGuides?.left?.guide?.left - curGuides.left.offset;
        curBorder(curGuides?.left?.guide?.left - curGuides.left.offset, null);
      } else {
        circle.x = mousePos.left;
        content.x = mousePos.left;
      }

      // 改变border的位置
      function curBorder(x, y) {
        window.app.stage.children.forEach((container) => {
          if (container.type === 'sizeContainer') {
            container.children.forEach((itemSprite) => {
              if (
                itemSprite.type === 'border' ||
                itemSprite.type === 'dashborder'
              ) {
                if (x) {
                  itemSprite.x = x;
                }
                if (y) {
                  itemSprite.y = y;
                }
              }
            });
          }
        });
      }

      const GuidCont =
        window.app.stage.children.find((val) => val?.id === 'GUIDE')
          ?.children || [];
      let activeGuidesId = [];
      if (curGuides.left?.guide?.id) {
        activeGuidesId.push(curGuides.left?.guide?.id);
      }
      if (curGuides.top?.guide?.id) {
        activeGuidesId.push(curGuides.top?.guide?.id);
      }
      GuidCont.forEach((item) => {
        item.visible = false;
        activeGuidesId.forEach((it) => {
          if (item.id === it) {
            item.visible = true;
          }
        });
      });
    }
  }

  function rectMouseUp(circle, event) {
    const newPosition = circle?.data?.getLocalPosition(circle.parent);
    if (newPosition) {
      let mousePos = {
        left: circle.x,
        top: circle.y,
      };

      // 矩形拖拽结束时显示圆点并从新计算位置
      window.app.stage.children.forEach((container) => {
        if (container.type === 'sizeContainer') {
          container.children.forEach((itemSprite) => {
            if (itemSprite.type === 'zoomCircle') {
              let R = content.height / 2 + 60;
              switch (itemSprite.posId) {
                case 'topLeft':
                  itemSprite.x =
                    Math.cos(content.rotation) *
                      (content.x - content.width / 2 - content.x) -
                    Math.sin(content.rotation) *
                      (content.y - content.height / 2 - content.y) +
                    mousePos.left;
                  itemSprite.y =
                    Math.sin(content.rotation) *
                      (content.x - content.width / 2 - content.x) +
                    Math.cos(content.rotation) *
                      (content.y - content.height / 2 - content.y) +
                    mousePos.top;
                  break;
                case 'topRight':
                  itemSprite.x =
                    Math.cos(content.rotation) *
                      (content.x + content.width / 2 - content.x) -
                    Math.sin(content.rotation) *
                      (content.y - content.height / 2 - content.y) +
                    mousePos.left;
                  itemSprite.y =
                    Math.sin(content.rotation) *
                      (content.x + content.width / 2 - content.x) +
                    Math.cos(content.rotation) *
                      (content.y - content.height / 2 - content.y) +
                    mousePos.top;
                  break;
                case 'bottomRight':
                  itemSprite.x =
                    Math.cos(content.rotation) * (content.width / 2) -
                    Math.sin(content.rotation) * (content.height / 2) +
                    mousePos.left;
                  itemSprite.y =
                    Math.sin(content.rotation) * (content.width / 2) +
                    Math.cos(content.rotation) * (content.height / 2) +
                    mousePos.top;
                  break;
                case 'bottomLeft':
                  itemSprite.x =
                    Math.cos(content.rotation) *
                      (content.x - content.width / 2 - content.x) -
                    Math.sin(content.rotation) *
                      (content.y + content.height / 2 - content.y) +
                    mousePos.left;
                  itemSprite.y =
                    Math.sin(content.rotation) *
                      (content.x - content.width / 2 - content.x) +
                    Math.cos(content.rotation) *
                      (content.y + content.height / 2 - content.y) +
                    mousePos.top;
                  break;
                case 'rotation':
                  itemSprite.x = content.x - R * Math.sin(content.rotation);
                  itemSprite.y = content.y + R * Math.cos(content.rotation);
                  break;
                default:
                  break;
              }
              itemSprite.visible = true;
            }
          });
        }
      });
    }
    circle.dragging = false;
    circle.data = null;
    // tools.removeEventHandler(document.body, 'mousemove', rectMouseMove);

    // 去除辅助线
    const GuidCont =
      window.app.stage.children.find((val) => val?.id === 'GUIDE')?.children ||
      [];
    GuidCont.forEach((it) => {
      it.visible = false;
    });

    callback && callback();
  }
};

// 建点
export const drawCircle = (sizeContainer, content, callback) => {
  let circleMouseDownX,
    circleMouseDownY,
    oldRectWidth,
    oldRectHeight,
    oldRectX,
    oldRectY,
    oldWHRatio,
    oldRWHRatio,
    spot = {},
    oldRotation;

  let R = content.height / 2 + 60;
  let imgRL = [
    {
      x:
        Math.cos(content.rotation) *
          (content.x - content.width / 2 - content.x) -
        Math.sin(content.rotation) *
          (content.y - content.height / 2 - content.y) +
        content.x,
      y:
        Math.sin(content.rotation) *
          (content.x - content.width / 2 - content.x) +
        Math.cos(content.rotation) *
          (content.y - content.height / 2 - content.y) +
        content.y,
      cursor: 'nwse-resize',
      posId: 'topLeft',
    },
    {
      x:
        Math.cos(content.rotation) *
          (content.x + content.width / 2 - content.x) -
        Math.sin(content.rotation) *
          (content.y - content.height / 2 - content.y) +
        content.x,
      y:
        Math.sin(content.rotation) *
          (content.x + content.width / 2 - content.x) +
        Math.cos(content.rotation) *
          (content.y - content.height / 2 - content.y) +
        content.y,
      cursor: 'nesw-resize',
      posId: 'topRight',
    },
    {
      x:
        Math.cos(content.rotation) * (content.width / 2) -
        Math.sin(content.rotation) * (content.height / 2) +
        content.x,
      y:
        Math.sin(content.rotation) * (content.width / 2) +
        Math.cos(content.rotation) * (content.height / 2) +
        content.y,
      cursor: 'nwse-resize',
      posId: 'bottomRight',
    },
    {
      x:
        Math.cos(content.rotation) *
          (content.x - content.width / 2 - content.x) -
        Math.sin(content.rotation) *
          (content.y + content.height / 2 - content.y) +
        content.x,
      y:
        Math.sin(content.rotation) *
          (content.x - content.width / 2 - content.x) +
        Math.cos(content.rotation) *
          (content.y + content.height / 2 - content.y) +
        content.y,
      cursor: 'nesw-resize',
      posId: 'bottomLeft',
    },
    {
      x: content.x - R * Math.sin(content.rotation),
      y: content.y + R * Math.cos(content.rotation),
      cursor: 'pointer',
      posId: 'rotation',
    },
  ];
  imgRL.forEach((element) => {
    if (element.posId !== 'rotation') {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(0); // 绘制一个圆，将lineStyle设置为零，以便圆没有轮廓
      graphics.beginFill(0xffffff, 1);
      graphics.drawCircle(element.x, element.y, circleWidth);
      graphics.endFill();
      const texture = window.app.renderer.generateTexture(graphics);
      let sprite = new PIXI.Sprite();
      sprite.type = 'zoomCircle';
      sprite.zIndex = 100000;
      sprite.posId = element.posId;
      sprite.interactive = true; //响应交互
      sprite.cursor = element.cursor;
      sprite.texture = texture;
      sprite.anchor.set(0.5);
      sprite.rotation = content.rotation || 0;
      sprite.x = element.x;
      sprite.y = element.y;
      sprite.on('mousedown', (event) => {
        circleMouseDown(sprite, event);
      });
      sprite.on('mousemove', (event) => {
        circleMouseMove(sprite, event);
      });
      sprite.on('mouseup', (event) => {
        circleMouseup(sprite, event);
      });
      sprite.on('mouseupoutside', (event) => {
        circleMouseup(sprite, event);
      });
      sizeContainer.addChild(sprite);
    } else {
      let texture = PIXI.Texture.from(rotate_icon);
      let sprite = new PIXI.Sprite();
      sprite.type = 'zoomCircle';
      sprite.zIndex = 100000;
      sprite.posId = element.posId;
      sprite.interactive = true; //响应交互
      sprite.cursor = element.cursor;
      sprite.texture = texture;
      sprite.anchor.set(0.5);
      sprite.rotation = content.rotation || 0;
      sprite.x = element.x;
      sprite.y = element.y;
      sprite.width = 72;
      sprite.height = 72;
      sprite.on('mousedown', (event) => {
        circleMouseDown(sprite, event);
      });
      sprite.on('mousemove', (event) => {
        circleMouseMove(sprite, event);
      });
      sprite.on('mouseup', (event) => {
        circleMouseup(sprite, event);
      });
      sprite.on('mouseupoutside', (event) => {
        circleMouseup(sprite, event);
      });
      sizeContainer.addChild(sprite);
    }
  });

  // tips
  // let srcTips = `<svg><foreignObject x="0" y="0" width="100%" height="100%"><div style="padding: 10px; background: #FFFFFF; color: #000000; fontSize: 36px">${(content.rotation * 180 / Math.PI).toFixed(0)}°</div></foreignObject></svg>`
  // let tipsText = new PIXI.Texture.from(srcTips)
  // let spriteTips = new PIXI.Sprite()
  const graphicstTips = new PIXI.Graphics();
  graphicstTips.lineStyle(0); // 绘制一个圆，将lineStyle设置为零，以便圆没有轮廓
  graphicstTips.beginFill(0xffffff, 1);
  graphicstTips.drawRoundedRect(
    window.app.renderer.view.width / 2,
    50,
    100,
    60,
    30,
  );
  graphicstTips.endFill();
  graphicstTips.type = 'tips';
  graphicstTips.zIndex = 100000;
  graphicstTips.posId = 'tips';
  graphicstTips.visible = false;
  sizeContainer.addChild(graphicstTips);
  let spriteTips = new PIXI.Text(
    `${((content.rotation * 180) / Math.PI).toFixed(0)}°`,
    {
      fill: ['#000000'],
      fontSize: 36,
      fontWeight: 'bold',
    },
  );
  spriteTips.type = 'tips';
  spriteTips.zIndex = 100000;
  spriteTips.posId = 'tips';
  spriteTips.x = window.app.renderer.view.width / 2 + 20;
  spriteTips.y = 50 + 10;
  spriteTips.visible = false;
  sizeContainer.addChild(spriteTips);

  function circleMouseDown(circle, event) {
    circle.data = event.data;
    circle.dragging = true;
    circleMouseDownX = event.data.global.x - circle.x;
    circleMouseDownY = event.data.global.y - circle.y;
    oldRectWidth = content.width;
    oldRectHeight = content.height;
    oldRectX = content.x;
    oldRectY = content.y;
    oldWHRatio =
      (content.height / content.width + Math.tan(content.rotation)) /
      (
        1 -
        (content.height / content.width) * Math.tan(content.rotation)
      ).toFixed(1);
    oldRWHRatio =
      (content.height / content.width - Math.tan(content.rotation)) /
      (
        1 +
        (content.height / content.width) * Math.tan(content.rotation)
      ).toFixed(1);
    oldRotation = content.rotation;

    window.app.stage.children.forEach((container) => {
      // 改变辅助框位置及大小
      if (container.type === 'sizeContainer') {
        container.children.forEach((item) => {
          if (item.type === 'zoomCircle') {
            spot[item.posId] = {
              x: item.x,
              y: item.y,
            };
          }
          if (item.type === 'border') {
            item.visible = false;
          }
          if (item.type === 'dashborder') {
            item.visible = true;
          }
        });
      }
    });
  }

  function circleMouseMove(circle) {
    const newPosition = circle?.data?.getLocalPosition(circle.parent);
    if (newPosition && circle) {
      dragHandle(circle, newPosition);
    }
  }

  function dragHandle(circle, newPosition) {
    let mousePos,
      newWidth,
      newHeight,
      offsetWidth,
      offsetHeight,
      whRatio,
      bevel,
      offsetBevel,
      newBevel,
      bk;
    if (!circle?.dragging) {
      return;
    }
    switch (circle.posId) {
      case 'topLeft':
        // 移动鼠标后的坐标
        mousePos = {
          left: newPosition.x - circleMouseDownX,
          top:
            (newPosition.x - circleMouseDownX - oldRectX) * oldWHRatio +
            oldRectY,
        };

        whRatio = oldRectHeight / oldRectWidth;
        bevel = oldRectWidth / Math.cos(Math.atan(whRatio));
        offsetBevel = mousePos.left - spot['topLeft'].x;
        bk =
          content.rotation - Math.atan(oldRectWidth / oldRectHeight) > 0 &&
          content.rotation - Math.atan(oldRectWidth / oldRectHeight) < Math.PI;
        newBevel = bk ? bevel + offsetBevel : bevel - offsetBevel;

        newWidth = newBevel * Math.cos(Math.atan(whRatio));
        newHeight = newBevel * Math.sin(Math.atan(whRatio));
        offsetWidth = oldRectWidth - newWidth;
        offsetHeight = oldRectHeight - newHeight;

        if (newWidth > MINSIZE && newHeight > MINSIZE) {
          circle.x =
            spot['topLeft'].x + offsetBevel * Math.cos(Math.atan(oldWHRatio));
          circle.y =
            spot['topLeft'].y + offsetBevel * Math.sin(Math.atan(oldWHRatio));
          window.app.stage.children.forEach((container) => {
            // 改变辅助框位置及大小
            if (container.type === 'sizeContainer') {
              container.children.forEach((item) => {
                if (item.type === 'dragRect') {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(oldWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(oldWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
                if (item.type === 'zoomCircle') {
                  switch (item.posId) {
                    case 'topRight':
                      item.x =
                        spot['topRight'].x -
                        offsetHeight * Math.sin(content.rotation);
                      item.y =
                        spot['topRight'].y +
                        offsetHeight * Math.cos(content.rotation);
                      break;
                    case 'bottomLeft':
                      item.x =
                        spot['bottomLeft'].x +
                        offsetWidth * Math.cos(content.rotation);
                      item.y =
                        spot['bottomLeft'].y +
                        offsetWidth * Math.sin(content.rotation);
                      break;
                    case 'rotation':
                      item.visible = false;
                      break;
                    default:
                      break;
                  }
                }
                if (item.type === 'dashborder' || item.type === 'border') {
                  switch (item.posId) {
                    case 'top':
                      item.width = newWidth;
                      item.pivot.y = newHeight / 2;
                      break;
                    case 'right':
                      item.height = newHeight;
                      item.pivot.x = -newWidth / 2;
                      break;
                    case 'bottom':
                      item.width = newWidth;
                      item.pivot.y = -newHeight / 2;
                      break;
                    case 'left':
                      item.height = newHeight;
                      item.pivot.x = newWidth / 2;
                      break;
                    default:
                      break;
                  }
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(oldWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(oldWHRatio))) / 2;
                }
              });
            }

            // 改变精灵位置及大小
            if (container.type === 'STAGE') {
              container.children.forEach((item) => {
                if (item.id === content.id) {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(oldWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(oldWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
              });
            }
          });
        }
        break;
      case 'topRight':
        // 移动鼠标后的坐标
        mousePos = {
          left: newPosition.x - circleMouseDownX,
          top:
            (newPosition.x - circleMouseDownX - (oldRectX + oldRectWidth)) *
              -oldWHRatio +
            oldRectY -
            oldRectHeight,
        };

        whRatio = oldRectHeight / oldRectWidth;
        bevel = oldRectWidth / Math.cos(Math.atan(whRatio));
        offsetBevel = mousePos.left - spot['topRight'].x;
        bk =
          Math.PI * 2 - content.rotation >
            Math.atan(oldRectWidth / oldRectHeight) &&
          content.rotation + Math.atan(oldRectWidth / oldRectHeight) > Math.PI;
        newBevel = bk ? bevel - offsetBevel : bevel + offsetBevel;

        newWidth = newBevel * Math.cos(Math.atan(whRatio));
        newHeight = newBevel * Math.sin(Math.atan(whRatio));
        offsetWidth = oldRectWidth - newWidth;
        offsetHeight = oldRectHeight - newHeight;

        if (newWidth > MINSIZE && newHeight > MINSIZE) {
          circle.x =
            spot['topRight'].x +
            offsetBevel * Math.cos(Math.atan(-oldRWHRatio));
          circle.y =
            spot['topRight'].y +
            offsetBevel * Math.sin(Math.atan(-oldRWHRatio));
          window.app.stage.children.forEach((container) => {
            // 改变辅助框位置及大小
            if (container.type === 'sizeContainer') {
              container.children.forEach((item) => {
                if (item.type === 'dragRect') {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(-oldRWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(-oldRWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
                if (item.type === 'zoomCircle') {
                  switch (item.posId) {
                    case 'topLeft':
                      item.x =
                        spot['topLeft'].x -
                        offsetHeight * Math.sin(content.rotation);
                      item.y =
                        spot['topLeft'].y +
                        offsetHeight * Math.cos(content.rotation);
                      break;
                    case 'bottomRight':
                      item.x =
                        spot['bottomRight'].x -
                        offsetWidth * Math.cos(content.rotation);
                      item.y =
                        spot['bottomRight'].y -
                        offsetWidth * Math.sin(content.rotation);
                      break;
                    case 'rotation':
                      item.visible = false;
                      break;
                    default:
                      break;
                  }
                }
                if (item.type === 'dashborder' || item.type === 'border') {
                  switch (item.posId) {
                    case 'top':
                      item.width = newWidth;
                      item.pivot.y = newHeight / 2;
                      break;
                    case 'right':
                      item.height = newHeight;
                      item.pivot.x = -newWidth / 2;
                      break;
                    case 'bottom':
                      item.width = newWidth;
                      item.pivot.y = -newHeight / 2;
                      break;
                    case 'left':
                      item.height = newHeight;
                      item.pivot.x = newWidth / 2;
                      break;
                    default:
                      break;
                  }
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(-oldRWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(-oldRWHRatio))) / 2;
                }
              });
            }

            // 改变精灵位置及大小
            if (container.type === 'STAGE') {
              container.children.forEach((item) => {
                if (item.id === content.id) {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(-oldRWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(-oldRWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
              });
            }
          });
        }
        break;
      case 'bottomRight':
        // 移动鼠标后的坐标
        mousePos = {
          left: newPosition.x - circleMouseDownX,
          top:
            (newPosition.x - circleMouseDownX - oldRectX) * oldWHRatio +
            oldRectY,
        };

        whRatio = oldRectHeight / oldRectWidth;
        bevel = oldRectWidth / Math.cos(Math.atan(whRatio));
        offsetBevel = mousePos.left - spot['bottomRight'].x;
        bk =
          content.rotation - Math.atan(oldRectWidth / oldRectHeight) > 0 &&
          content.rotation - Math.atan(oldRectWidth / oldRectHeight) < Math.PI;
        newBevel = bk ? bevel - offsetBevel : bevel + offsetBevel;

        newWidth = newBevel * Math.cos(Math.atan(whRatio));
        newHeight = newBevel * Math.sin(Math.atan(whRatio));
        offsetWidth = oldRectWidth - newWidth;
        offsetHeight = oldRectHeight - newHeight;

        if (newWidth > MINSIZE && newHeight > MINSIZE) {
          circle.x =
            spot['bottomRight'].x +
            offsetBevel * Math.cos(Math.atan(oldWHRatio));
          circle.y =
            spot['bottomRight'].y +
            offsetBevel * Math.sin(Math.atan(oldWHRatio));
          window.app.stage.children.forEach((container) => {
            // 改变辅助框位置及大小
            if (container.type === 'sizeContainer') {
              container.children.forEach((item) => {
                if (item.type === 'dragRect') {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(oldWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(oldWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
                if (item.type === 'zoomCircle') {
                  switch (item.posId) {
                    case 'topRight':
                      item.x =
                        spot['topRight'].x -
                        offsetWidth * Math.cos(content.rotation);
                      item.y =
                        spot['topRight'].y -
                        offsetWidth * Math.sin(content.rotation);
                      break;
                    case 'bottomLeft':
                      item.x =
                        spot['bottomLeft'].x +
                        offsetHeight * Math.sin(content.rotation);
                      item.y =
                        spot['bottomLeft'].y -
                        offsetHeight * Math.cos(content.rotation);
                      break;
                    case 'rotation':
                      item.visible = false;
                      break;
                    default:
                      break;
                  }
                }
                if (item.type === 'dashborder' || item.type === 'border') {
                  switch (item.posId) {
                    case 'top':
                      item.width = newWidth;
                      item.pivot.y = newHeight / 2;
                      break;
                    case 'right':
                      item.height = newHeight;
                      item.pivot.x = -newWidth / 2;
                      break;
                    case 'bottom':
                      item.width = newWidth;
                      item.pivot.y = -newHeight / 2;
                      break;
                    case 'left':
                      item.height = newHeight;
                      item.pivot.x = newWidth / 2;
                      break;
                    default:
                      break;
                  }
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(oldWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(oldWHRatio))) / 2;
                }
              });
            }

            // 改变精灵位置及大小
            if (container.type === 'STAGE') {
              container.children.forEach((item) => {
                if (item.id === content.id) {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(oldWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(oldWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
              });
            }
          });
        }
        break;
      case 'bottomLeft':
        // 移动鼠标后的坐标
        mousePos = {
          left: newPosition.x - circleMouseDownX,
          top:
            (newPosition.x - circleMouseDownX - (oldRectX + oldRectWidth)) *
              -oldWHRatio +
            oldRectY -
            oldRectHeight,
        };

        whRatio = oldRectHeight / oldRectWidth;
        bevel = oldRectWidth / Math.cos(Math.atan(whRatio));
        offsetBevel = mousePos.left - spot['bottomLeft'].x;
        bk =
          Math.PI * 2 - content.rotation >
            Math.atan(oldRectWidth / oldRectHeight) &&
          content.rotation + Math.atan(oldRectWidth / oldRectHeight) > Math.PI;
        newBevel = bk ? bevel + offsetBevel : bevel - offsetBevel;

        newWidth = newBevel * Math.cos(Math.atan(whRatio));
        newHeight = newBevel * Math.sin(Math.atan(whRatio));
        offsetWidth = oldRectWidth - newWidth;
        offsetHeight = oldRectHeight - newHeight;

        if (newWidth > MINSIZE && newHeight > MINSIZE) {
          circle.x =
            spot['bottomLeft'].x +
            offsetBevel * Math.cos(Math.atan(-oldRWHRatio));
          circle.y =
            spot['bottomLeft'].y +
            offsetBevel * Math.sin(Math.atan(-oldRWHRatio));
          window.app.stage.children.forEach((container) => {
            // 改变辅助框位置及大小
            if (container.type === 'sizeContainer') {
              container.children.forEach((item) => {
                if (item.type === 'dragRect') {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(-oldRWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(-oldRWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
                if (item.type === 'zoomCircle') {
                  switch (item.posId) {
                    case 'topLeft':
                      item.x =
                        spot['topLeft'].x +
                        offsetWidth * Math.cos(content.rotation);
                      item.y =
                        spot['topLeft'].y +
                        offsetWidth * Math.sin(content.rotation);
                      break;
                    case 'bottomRight':
                      item.x =
                        spot['bottomRight'].x +
                        offsetHeight * Math.sin(content.rotation);
                      item.y =
                        spot['bottomRight'].y -
                        offsetHeight * Math.cos(content.rotation);
                      break;
                    case 'rotation':
                      item.visible = false;
                      break;
                    default:
                      break;
                  }
                }
                if (item.type === 'dashborder' || item.type === 'border') {
                  switch (item.posId) {
                    case 'top':
                      item.width = newWidth;
                      item.pivot.y = newHeight / 2;
                      break;
                    case 'right':
                      item.height = newHeight;
                      item.pivot.x = -newWidth / 2;
                      break;
                    case 'bottom':
                      item.width = newWidth;
                      item.pivot.y = -newHeight / 2;
                      break;
                    case 'left':
                      item.height = newHeight;
                      item.pivot.x = newWidth / 2;
                      break;
                    default:
                      break;
                  }
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(-oldRWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(-oldRWHRatio))) / 2;
                }
              });
            }

            // 改变精灵位置及大小
            if (container.type === 'STAGE') {
              container.children.forEach((item) => {
                if (item.id === content.id) {
                  item.x =
                    oldRectX +
                    (offsetBevel * Math.cos(Math.atan(-oldRWHRatio))) / 2;
                  item.y =
                    oldRectY +
                    (offsetBevel * Math.sin(Math.atan(-oldRWHRatio))) / 2;
                  item.width = newWidth;
                  item.height = newHeight;
                }
              });
            }
          });
        }
        break;
      case 'rotation':
        // 移动鼠标后的坐标
        mousePos = {
          left: newPosition.x - circleMouseDownX,
          top: newPosition.y - circleMouseDownY,
        };

        let R = content.height / 2 + 60;
        let newRotation =
          Math.atan2(mousePos.top - content.y, mousePos.left - content.x) -
            Math.PI / 2 >
          0
            ? Math.atan2(mousePos.top - content.y, mousePos.left - content.x) -
              Math.PI / 2
            : Math.PI * 2 +
              (Math.atan2(mousePos.top - content.y, mousePos.left - content.x) -
                Math.PI / 2);
        let modeArr = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        let MERROR = 2;
        modeArr.forEach((it) => {
          if (Math.abs((newRotation * 180) / Math.PI - it) < MERROR) {
            newRotation = (it * Math.PI) / 180;
          }
        });
        content.rotation = newRotation;
        // callback && callback()
        circle.x = content.x - R * Math.sin(content.rotation);
        circle.y = content.y + R * Math.cos(content.rotation);
        window.app.stage.children.forEach((container) => {
          // 改变辅助框位置及大小
          if (container.type === 'sizeContainer') {
            container.children.forEach((item) => {
              if (item.type === 'dragRect') {
                item.rotation = newRotation;
              }
              if (item.type === 'dashborder' || item.type === 'border') {
                item.rotation = newRotation;
              }
              if (item.type === 'zoomCircle' && item.posId !== 'rotation') {
                item.visible = false;
              }
              if (item.type === 'tips') {
                item.text = `${((newRotation * 180) / Math.PI).toFixed(0)}°`;
                item.visible = true;
              }
            });
          }
        });

        break;
      default:
        break;
    }
  }

  function circleMouseup(circle) {
    circle.dragging = false;
    circle.data = null;

    window.app.stage.children.forEach((container) => {
      if (container.type === 'sizeContainer') {
        container.children.forEach((itemSprite) => {
          if (itemSprite.type === 'border') {
            itemSprite.visible = true;
          }
          if (itemSprite.type === 'dashborder') {
            itemSprite.visible = false;
          }
          if (itemSprite.type === 'zoomCircle') {
            switch (itemSprite.posId) {
              case 'topLeft':
                itemSprite.x =
                  Math.cos(content.rotation) *
                    (content.x - content.width / 2 - content.x) -
                  Math.sin(content.rotation) *
                    (content.y - content.height / 2 - content.y) +
                  content.x;
                itemSprite.y =
                  Math.sin(content.rotation) *
                    (content.x - content.width / 2 - content.x) +
                  Math.cos(content.rotation) *
                    (content.y - content.height / 2 - content.y) +
                  content.y;
                break;
              case 'topRight':
                itemSprite.x =
                  Math.cos(content.rotation) *
                    (content.x + content.width / 2 - content.x) -
                  Math.sin(content.rotation) *
                    (content.y - content.height / 2 - content.y) +
                  content.x;
                itemSprite.y =
                  Math.sin(content.rotation) *
                    (content.x + content.width / 2 - content.x) +
                  Math.cos(content.rotation) *
                    (content.y - content.height / 2 - content.y) +
                  content.y;
                break;
              case 'bottomRight':
                itemSprite.x =
                  Math.cos(content.rotation) * (content.width / 2) -
                  Math.sin(content.rotation) * (content.height / 2) +
                  content.x;
                itemSprite.y =
                  Math.sin(content.rotation) * (content.width / 2) +
                  Math.cos(content.rotation) * (content.height / 2) +
                  content.y;
                break;
              case 'bottomLeft':
                itemSprite.x =
                  Math.cos(content.rotation) *
                    (content.x - content.width / 2 - content.x) -
                  Math.sin(content.rotation) *
                    (content.y + content.height / 2 - content.y) +
                  content.x;
                itemSprite.y =
                  Math.sin(content.rotation) *
                    (content.x - content.width / 2 - content.x) +
                  Math.cos(content.rotation) *
                    (content.y + content.height / 2 - content.y) +
                  content.y;
                break;
              case 'rotation':
                let R = content.height / 2 + 60;
                itemSprite.x = content.x - R * Math.sin(content.rotation);
                itemSprite.y = content.y + R * Math.cos(content.rotation);
                container.children.forEach((it) => {
                  if (it.posId === 'tips') {
                    it.visible = false;
                  }
                });
                break;
              default:
                break;
            }
            itemSprite.visible = true;
          }
        });
      }
    });

    // tools.removeEventHandler(document.body, 'mousemove', circleMouseMove);
    callback && callback();
  }
};
