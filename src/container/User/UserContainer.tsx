import React, { useMemo } from 'react';
import AuthContainer from './AuthContainer';

interface UserInfo {
    userId: string;
    email: string;
    name: string;
}

interface UserContainerProps {
    user?: UserInfo;
}

export const UserContext = React.createContext<UserContainerProps>({} as any);

const UserContainer = React.memo<React.PropsWithChildren<unknown>>((props) => {
    const { children } = props;

    const user: UserInfo = useMemo(() => {
        return {
            userId: '',
            email: '',
            name: '',
        };
    }, []);

    const memoCtx = useMemo(() => {
        return {
            user,
        };
    }, []);

    return (
        <UserContext.Provider value={memoCtx}>
            <AuthContainer>{children}</AuthContainer>
        </UserContext.Provider>
    );
});

export default UserContainer;
