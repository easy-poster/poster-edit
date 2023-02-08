import emitter, { CANVAS } from '@/helper/emitter';
import { useCallback, useEffect } from 'react';

/**
 * @description Canvas相关hooks
 * @returns
 */
export default function useCanvas() {
    /**
     * @name 画布大小调节
     */
    const sizeStageEmit = useCallback(() => {
        emitter.emit(CANVAS.SIZE_STAGE);
    }, []);

    /**
     * @name sizeStageEmit监听
     */
    const sizeStageOn = (callback: () => void) => {
        emitter.on(CANVAS.SIZE_STAGE, () => callback());
    };

    useEffect(() => {
        return () => {
            emitter.off(CANVAS.SIZE_STAGE);
        };
    }, []);

    return {
        sizeStageEmit,
        sizeStageOn,
    };
}
