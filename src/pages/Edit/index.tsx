import React, { useCallback } from 'react';
import SizeBar from './components/SizeBar';
import Stage from './Stage';
import StageContainer from './StageContainer';
import EditHeader from './components/EditHeader';
// import EditFooter from './components/EditFooter';
import styles from './index.less';
import EditTopBar from './components/EditTopBar';

const Edit = React.memo(() => {
    return (
        <div className={styles.editRight}>
            <StageContainer>
                <EditHeader />
                <div className={styles.editContent}>
                    <EditTopBar />
                    <div className={styles.editMain}>
                        <Stage />
                        <SizeBar />
                    </div>
                    {/* <EditFooter /> */}
                </div>
            </StageContainer>
        </div>
    );
});

export default Edit;
