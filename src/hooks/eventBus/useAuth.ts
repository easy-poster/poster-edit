import emitter, { AUTH } from '@/helper/emitter';
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
        emitter.emit(AUTH.REFRESH_VC);
    }, []);

    /**
     * @name 刷新图形验证码监听
     */
    const refreshCaptchaOn = (callback: () => void) => {
        emitter.on(AUTH.REFRESH_VC, () => callback());
    };

    useEffect(() => {
        return () => {
            emitter.all.clear();
        };
    }, []);

    return {
        refreshCaptchaEmit,
        refreshCaptchaOn,
    };
}
