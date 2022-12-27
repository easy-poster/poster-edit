import mitt from 'mitt';

const Emitter = mitt();

export default Emitter;

export enum CANVAS {
    /** @name 添加资源 */
    ADD_RESOURCE = 'Canvas.AddResource',
    /** @name 删除资源 */
    DEL_RESOURCE = 'Canvas.delResource',
}
