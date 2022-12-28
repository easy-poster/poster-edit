import { debounce } from 'lodash';
import ReactDOM from 'react-dom';
import { Handler } from '.';

/**
 * @description 右键菜单
 */
class ContextmenuHandler {
    handler: Handler;
    contextmenuEl: HTMLDivElement;

    constructor(handler: Handler) {
        this.handler = handler;

        this.contextmenuEl = document.createElement('div');
        this.contextmenuEl.id = `${this.handler.id}_contextmenu`;
        this.contextmenuEl.className = 'rde-contextmenu contextmenu-hidden';
        document.body.appendChild(this.contextmenuEl);
    }

    /**
     * @name 销毁上下文菜单
     */
    public destroy() {
        if (this.contextmenuEl) {
            document.body.removeChild(this.contextmenuEl);
        }
    }

    public show = debounce(async (e, target) => {
        const { onContext } = this.handler;
        if (!onContext) return;
        while (this.contextmenuEl.hasChildNodes()) {
            this.contextmenuEl.removeChild(this.contextmenuEl.firstChild!);
        }
        const contextmenu = document.createElement('div');
        contextmenu.className = 'rde-contextmenu-right';
        const element = await onContext(this.contextmenuEl, e, target);
        if (!element) {
            return;
        }
        contextmenu.innerHTML = element;
        this.contextmenuEl.appendChild(contextmenu);
        ReactDOM.render(element, contextmenu);
        this.contextmenuEl.classList.remove('contextmenu-hidden');
        const { clientX: left, clientY: top } = e;
        this.contextmenuEl.style.left = `${left}px`;
        this.contextmenuEl.style.top = `${top}px`;
    }, 100);

    public hide = debounce(() => {
        if (this.contextmenuEl) {
            this.contextmenuEl.classList.add('contextmenu-hidden');
        }
    }, 100);
}

export default ContextmenuHandler;
