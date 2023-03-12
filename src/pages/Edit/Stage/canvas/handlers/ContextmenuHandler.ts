import { debounce } from 'lodash';
import { Handler } from '.';

/**
 * @description 右键菜单
 */
class ContextmenuHandler {
    handler: Handler;

    constructor(handler: Handler) {
        this.handler = handler;
    }

    /**
     * @name 销毁上下文菜单
     */
    public destroy() {}

    public show = debounce(async (e, target) => {
        const { onContext } = this.handler;
        if (onContext) {
            onContext({
                show: true,
                e: e,
                target: target,
            });
        }
    }, 100);

    public hide = debounce((e?: any) => {
        const { onContext } = this.handler;
        if (onContext) {
            onContext({
                show: false,
                e,
            });
        }
    }, 100);
}

export default ContextmenuHandler;
