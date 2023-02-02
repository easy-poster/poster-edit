import React from 'react';
import styles from './index.less';
import BrandContainer from './container';
import { Outlet } from '@umijs/max';
import BrandKitContainer from './container/BrandKitContainer';

const Brand = React.memo(() => {
    return (
        <div className={styles.brandWrap}>
            <BrandContainer>
                <BrandKitContainer>
                    <Outlet />
                </BrandKitContainer>
            </BrandContainer>
        </div>
    );
});

export default Brand;
