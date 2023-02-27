import React, { useContext, useMemo, useRef } from 'react';
import {
    OperatingPanelContext,
    OperatingPanelType,
} from '@/pages/Edit/Container/OperatingPanelContainer';
import FontFamilyPanel from './FontFamilyPanel';
import FontStylePanel from './FontStylePanel';
import ImagePanel from './ImagePanel';
import FontColorPanel from './FontColorPanel';

const OperatingPanelMap = {
    [OperatingPanelType.IMAGE]: ImagePanel,
    [OperatingPanelType.FONTFAMILY]: FontFamilyPanel,
    [OperatingPanelType.FONTSTYLE]: FontStylePanel,
    [OperatingPanelType.FONTCOLOR]: FontColorPanel,
    [OperatingPanelType.NONE]: null,
};

const OperatingPanel = React.memo(() => {
    const { panelType } = useContext(OperatingPanelContext);

    const OperatingPanelMode = useMemo(() => {
        return OperatingPanelMap[panelType] || React.Fragment;
    }, [panelType]);

    return <OperatingPanelMode />;
});

export default OperatingPanel;
