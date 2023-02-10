import FunctionEmitter, { AUTH } from '@/helper/function';
import { useCallback, useEffect } from 'react';

/**
 * @description 认证相关hooks
 * @returns
 */
export default function useAuth() {
    /**
     * @name 刷新图形验证码执行
     */
    const refreshCaptchaEmit = useCallback(() => {
        FunctionEmitter.emit(AUTH.REFRESH_VC);
    }, []);

    /**
     * @name 刷新图形验证码监听
     */
    const refreshCaptchaOn = (callback: () => void) => {
        FunctionEmitter.on(AUTH.REFRESH_VC, () => callback());
    };

    useEffect(() => {
        return () => {
            FunctionEmitter.off(AUTH.REFRESH_VC);
        };
    }, []);

    return {
        refreshCaptchaEmit,
        refreshCaptchaOn,
    };
}
