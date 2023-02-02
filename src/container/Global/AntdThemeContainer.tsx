import { ConfigProvider } from 'antd';
import React from 'react';

const AntdThemeContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#209fa5',
                    colorLink: '#209fa5',
                    colorLinkHover: '#25b8c0',
                },
                components: {
                    Button: {
                        borderRadius: 4,
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
});

export default AntdThemeContainer;
