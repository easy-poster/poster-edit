import { throttle } from 'lodash';
import { fabric } from 'fabric';
import { Handler } from '.';

/**
 * @description 撤回重做事务处理
 */
class TransactionHandler {
    handler: Handler;
    redos: TransactionEvent[];
    undos: TransactionEvent[];
    active: boolean = false;
    state: FabricObject[] = [];

    constructor(handler: Handler) {
        this.handler = handler;
        this.redos = [];
        this.undos = [];
        this.state = [];
        this.active = false;
    }

    /**
     * @name 初始化撤销内容
     * @param initState
     */
    initState(initState: any) {
        this.state = initState || [];
    }

    /**
     * @name 保存事务流程
     * @param type
     * @param canvasJSON
     * @param _isWorkarea
     */
    public save = (
        type: TransactionType,
        canvasJSON?: any,
        _isWorkarea: boolean = true,
    ) => {
        if (!this.handler.keyEvent.transaction) return;
        try {
            if (this.state) {
                const json = JSON.stringify(this.state);
                this.redos = [];
                this.undos.push({
                    type,
                    json,
                });
            }
            const { objects }: { objects: FabricObject[] } =
                canvasJSON ||
                this.handler.canvas.toJSON(this.handler.propertiesToInclude);
            this.state = objects.filter((obj) => {
                if (obj.id === 'workarea') {
                    return false;
                }
                return true;
            });
        } catch (error) {
            console.error('transaction save', error);
        }
    };

    /**
     * @name 撤销
     */
    public undo = throttle(() => {
        const undo = this.undos.pop();
        if (!undo) return;
        this.redos.push({
            type: 'redo',
            json: JSON.stringify(this.state),
        });
        this.replay(undo);
    }, 100);

    /**
     * @name 重做
     */
    public redo = throttle(() => {
        const redo = this.redos.pop();
        if (!redo) return;
        this.undos.push({
            type: 'undo',
            json: JSON.stringify(this.state),
        });
        this.replay(redo);
    }, 100);

    /**
     * @name 回撤
     *
     * @param {TransactionEvent} transaction
     */
    public replay = (transaction: TransactionEvent) => {
        const objects = JSON.parse(transaction.json) as FabricObject[];
        this.state = objects;
        this.active = true;
        this.handler.canvas.renderOnAddRemove = false;
        this.handler.clear();
        this.handler.canvas.discardActiveObject();
        fabric.util.enlivenObjects(
            objects,
            (enlivenObjects: FabricObject[]) => {
                enlivenObjects.forEach((obj) => {
                    const targetIndex = this.handler.canvas._objects.length;
                    this.handler.canvas.insertAt(obj, targetIndex, false);
                });
                this.handler.canvas.renderOnAddRemove = true;
                this.active = false;
                this.handler.canvas.renderAll();
                this.handler.objects = this.handler.getObjects();
                if (this.handler.onTransaction) {
                    this.handler.onTransaction(transaction);
                }
            },
            '',
        );
    };
}

export default TransactionHandler;
