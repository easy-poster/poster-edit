import { message } from 'antd';
import { history } from '@umijs/max';
import GlobalContainer from './container/Global/GlobalContainer';
import { errorConfig } from './requestErrorConfig';
import { getUserInfo } from './services/user';

const loginPath = '/login';

export interface UserModelState {
    id: number;
    email: string;
    phone: number;
    username: string;
    age: number;
    gender: number;
    headImg: string;
    description: string;
    status: number;
    updateTime: Date;
    createTime: Date;
}

/**
 * @name dva配置
 */
export const dva = {
    config: {
        onError(e: Error) {
            message.error(e.message, 3);
        },
    },
};

/**
 * @name 初始化配置
 */
export async function getInitialState(): Promise<{
    currentUser?: UserModelState;
    getCurrentUserInfo?: () => Promise<UserModelState>;
}> {
    const getCurrentUserInfo = async () => {
        try {
            let res = await getUserInfo();
            return res;
        } catch (error) {
            /**
             * @todo 先注释，后面释放
             */
            // history.push(loginPath);
        }
        return undefined;
    };

    // 如果不是登录页执行
    const { location } = history;
    if (location.pathname !== loginPath) {
        const currentUser = await getCurrentUserInfo();
        return {
            getCurrentUserInfo,
            currentUser,
        };
    }

    return {
        getCurrentUserInfo,
    };
}

/**
 * @name 根组件
 */
export function rootContainer(container: React.ReactElement) {
    return <GlobalContainer>{container}</GlobalContainer>;
}

/**
 * @name 请求配置
 */
export const request = {
    ...errorConfig,
};
