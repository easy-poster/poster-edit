import mitt from 'mitt';

/**
 * @description 画布相关
 */
export enum CANVAS {
    /** @name 更新资源 */
    UPDATE_RESOURCE = 'Canvas.UpdateResource',
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

/**
 * @description 品牌相关
 */
export enum BRAND {
    REFRESH_FONT = 'Resfresh.font',
}

type EventsParams = {
    [CANVAS.UPDATE_RESOURCE]: FabricObject;
    [key: string]: any;
};

export const FUN = {
    ...CANVAS,
    ...AUTH,
    ...USER,
    ...BRAND,
};

const FunctionEmitter = mitt<EventsParams>();

export default FunctionEmitter;
