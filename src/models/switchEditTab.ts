import { useState } from 'react';

export default () => {
  const [activeTab, setActiveTab] = useState(2);
  return {
    activeTab,
    setActiveTab,
  };
};
