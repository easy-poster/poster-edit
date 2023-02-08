import React from 'react';
import { useModel, Outlet } from '@umijs/max';
import VipModal from '@/components/VipModal';
import EditContainer from '../Container';
import EditLeft from './EditLeft';
import styles from './index.less';

const EditLayout = React.memo(() => {
    const { isShowBuy } = useModel('buy');
    return (
        <div className={styles.editWrap}>
            <EditContainer>
                <EditLeft />
                <Outlet />
                <VipModal visible={isShowBuy} />
            </EditContainer>
        </div>
    );
});

export default EditLayout;
