import React, { useMemo } from 'react';

interface AuthContainerProps {
    isLogin: boolean;
    isVip: boolean;
}

export const AuthContext = React.createContext<AuthContainerProps>({
    isLogin: false,
    isVip: false,
});

/**
 * @description 用户认证相关
 */
const AuthContainer = React.memo<React.PropsWithChildren<{}>>((props) => {
    const { children } = props;

    const isLogin = useMemo(() => {
        return false;
    }, []);

    const isVip = useMemo(() => {
        return false;
    }, []);

    const memoCtx = useMemo(() => {
        return {
            isLogin,
            isVip,
        };
    }, []);

    return <AuthContext.Provider value={memoCtx}>{children}</AuthContext.Provider>;
});

export default AuthContainer;
