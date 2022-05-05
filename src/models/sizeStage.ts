import { useState } from 'react';

export default () => {
  const [sizeStage, setSizeStage] = useState(100);
  return {
    sizeStage,
    setSizeStage,
  };
};
