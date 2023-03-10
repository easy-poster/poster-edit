import React, { useContext, useMemo } from 'react';
import { FabricObjectType } from '@/const';
import { SelectContext } from '../../Container/SelectContainer';
import ImageBar from './ImageBar';
import TextBoxBar from './TextBoxBar';
import CommonBar from './CommonBar';
import GroupBar from './GroupBar';
import styles from './index.less';

const EditTopContainerMap = {
    [FabricObjectType.IMAGE]: ImageBar,
    [FabricObjectType.TEXTBOX]: TextBoxBar,
    [FabricObjectType.GROUP]: GroupBar,
};

const EditTopBar = React.memo(() => {
    const { selectType } = useContext(SelectContext);

    const EditTopBarMode = useMemo(() => {
        return EditTopContainerMap[selectType] || React.Fragment;
    }, [selectType]);

    return (
        <div className={styles.editTopBar}>
            <EditTopBarMode />
            {selectType && <CommonBar />}
        </div>
    );
});

export default EditTopBar;
