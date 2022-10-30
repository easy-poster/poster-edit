import { createLogger } from 'redux-logger';
import { message } from 'antd';
import GlobalContainer from './container/Global/GlobalContainer';

export const dva = {
    config: {
        // onAction: createLogger(),
        onError(e: Error) {
            message.error(e.message, 3);
        },
    },
};

export function rootContainer(container: React.ReactElement) {
    return <GlobalContainer>{container}</GlobalContainer>;
}
