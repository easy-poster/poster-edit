import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { IconFont } from '@/const';
import { Tooltip } from 'antd';
import BarButton from '../../components/BarButton';
import styles from './index.less';
import BridgeController from '@/helper/bridge/BridgeController';
import { SelectContext } from '@/pages/Edit/Container/SelectContainer';

const TextAlign = React.memo(() => {
    const textArr = ['left', 'center', 'right'];
    const { selectObj } = useContext(SelectContext);

    const [actAlign, setActAlign] = useState(() => selectObj?.textAlign);

    const IconAlignType = useMemo(() => {
        switch (actAlign) {
            case 'left':
                return 'icon-zuoduiqi';
            case 'center':
                return 'icon-juzhongduiqi';
            case 'right':
                return 'icon-youduiqi';
            default:
                return 'left';
        }
    }, [actAlign]);

    const handleClick = useCallback(() => {
        if (actAlign === 'right') {
            setActAlign(textArr[0]);
            BridgeController.SetedObjectStyle({
                textAlign: textArr[0],
            });
        } else {
            let nextIndex = textArr.map((item) => item).indexOf(actAlign) + 1;
            setActAlign(textArr[nextIndex]);
            BridgeController.SetedObjectStyle({
                textAlign: textArr[nextIndex],
            });
        }
    }, [actAlign]);

    useEffect(() => {
        if (!selectObj?.textAlign) return;
        setActAlign(selectObj?.textAlign);
    }, [selectObj?.textAlign]);

    return (
        <div className={styles.textAlignWrap}>
            <Tooltip title="对齐" placement="bottom">
                <BarButton onClick={handleClick}>
                    <IconFont
                        type={IconAlignType}
                        style={{ fontSize: '24px' }}
                    />
                </BarButton>
            </Tooltip>
        </div>
    );
});

export default TextAlign;
