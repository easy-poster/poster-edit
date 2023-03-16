import { message } from 'antd';
import GlobalContainer from './container/Global/GlobalContainer';

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
 * @name 根组件
 */
export function rootContainer(container: React.ReactElement) {
    return <GlobalContainer>{container}</GlobalContainer>;
}
