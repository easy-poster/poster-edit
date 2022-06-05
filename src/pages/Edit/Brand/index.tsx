import React from 'react';
import './index.less';

const BrandPage = () => {
  return (
    <div className="brand-edit-wrap">
      <div className="brand-item">
        <div className="brand-title">logo</div>
        <div className="brand-container">logo</div>
      </div>
      <div className="brand-item">
        <div className="brand-title">颜色</div>
        <div className="brand-container">color</div>
      </div>
      <div className="brand-item">
        <div className="brand-title">字体</div>
        <div className="brand-container">font</div>
      </div>
    </div>
  );
};

export default BrandPage;
