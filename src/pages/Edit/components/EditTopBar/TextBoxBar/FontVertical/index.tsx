import React, { useCallback } from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';

/**
 * @description 有点难后面再写
 */
const FontVertical = React.memo(() => {
    const handleClick = useCallback(() => {}, []);

    // fabric.Object.prototype.objectCaching = false; // 禁用对象缓存，避免出现渲染问题

    // fabric.util.charWidthsCache = {}; // 防止因为中文字体导致的无法计算字符宽度的问题

    // fabric.Text.prototype.drawChars = function (
    //     method,
    //     ctx,
    //     chars,
    //     left,
    //     top,
    //     isRight,
    //     declension,
    // ) {
    //     var declension = declension || 1;
    //     ctx.save();
    //     if (isRight) {
    //         ctx.translate(left, top);
    //     } else {
    //         ctx.translate(
    //             left,
    //             top - chars.length * declension * this.fontSize,
    //         );
    //     }
    //     ctx.rotate(((isRight ? -1 : 1) * 90 * Math.PI) / 180);
    //     for (var i = 0, len = chars.length; i < len; i++) {
    //         var char = chars[i];
    //         var charWidth = this.getCharWidth(char);
    //         var halfCharWidth = charWidth / 2;
    //         ctx[method](char, -halfCharWidth, i * declension * this.fontSize);
    //     }
    //     ctx.restore();
    // };

    // fabric.Text.prototype._render = function (ctx) {
    //     this.clipTo && fabric.util.clipContext(this, ctx);

    //     // 确保字体已经加载完成，否则可能会计算字符宽度失败
    //     if (!this.fontLoaded) {
    //         var _this = this;
    //         this.fontFamily = this.fontFamily || 'sans-serif';
    //         fabric.util.loadFont(this.fontFamily, {
    //             onSuccess: function () {
    //                 _this.fontLoaded = true;
    //                 _this._render(ctx);
    //             },
    //         });
    //         return;
    //     }

    //     // 只处理竖排文字
    //     if (this.vertical) {
    //         var textLines = this._splitText();
    //         var lineCount = textLines.length;
    //         var maxWidth = this.getLineWidth(0);
    //         var textLeftOffset = this._getTextLeftOffset();
    //         var textAlign = this.textAlign;
    //         for (var i = 0; i < lineCount; i++) {
    //             var chars = textLines[i].split('');
    //             var lineWidth = this.getLineWidth(i);
    //             var lineLeftOffset = this._getLineLeftOffset(lineWidth);
    //             var left =
    //                 this._getLeftOffset(textAlign, lineWidth, maxWidth) +
    //                 textLeftOffset +
    //                 lineLeftOffset;
    //             var top = this._getTopOffset(lineCount, i);
    //             this.drawChars(
    //                 'fillText',
    //                 ctx,
    //                 chars,
    //                 left,
    //                 top,
    //                 this.verticalAlign === 'bottom',
    //             );
    //         }
    //     } else {
    //         this.callSuper('_render', ctx);
    //     }

    //     this.clipTo && ctx.restore();
    // };

    return (
        <div className={styles.textVerticalWrap}>
            <Tooltip title="竖直排版" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont
                        type="icon-chuizhijianju"
                        style={{ fontSize: '26px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default FontVertical;
