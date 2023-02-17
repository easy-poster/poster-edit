import React, { useCallback, useMemo } from 'react';
import { useSelector } from '@umijs/max';
import { Button } from 'antd';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';

const EditTopBar = React.memo(() => {
    const { projectState } = useSelector(
        (state: { project: any; loading: any }) => {
            return {
                projectState: state.project,
            };
        },
    );

    const jsonStr = useMemo(() => {
        return projectState?.content;
    }, [projectState?.content]);

    const handleImport = useCallback(() => {
        BridgeController.ImportStageJSONString(jsonStr);
    }, [jsonStr]);

    return (
        <div className={styles.editTopBar}>
            EditTopBar
            {/* <Button onClick={handleImport}>导入</Button> */}
        </div>
    );
});

export default EditTopBar;
