import { useState } from 'react';

export default () => {
    const [activeTab, setActiveTab] = useState(1);
    return {
        activeTab,
        setActiveTab,
    };
};
