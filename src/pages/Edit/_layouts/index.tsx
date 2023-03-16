import React from 'react';
import { Outlet } from '@umijs/max';
import EditContainer from '../Container';
import EditLeft from './EditLeft';
import styles from './index.less';

const EditLayout = React.memo(() => {
    return (
        <div className={styles.editWrap}>
            <EditContainer>
                <EditLeft />
                <Outlet />
            </EditContainer>
        </div>
    );
});

export default EditLayout;
