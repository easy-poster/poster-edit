import mitt from 'mitt';

const emitter = mitt();

/**
 * @description 画布相关
 */
export enum CANVAS {
    /** @name 添加资源 */
    ADD_RESOURCE = 'Canvas.AddResource',
    /** @name 删除资源 */
    DEL_RESOURCE = 'Canvas.delResource',
}

/**
 * @description 认证相关
 */
export enum AUTH {
    /** @name 刷新验证码 */
    REFRESH_VC = 'Auth.RefreshVc',
}

/**
 * @description 用户相关
 */
export enum USER {}

export default emitter;
