import React, { useMemo, useState } from 'react';
import { MENU_EDIT } from '@/const';
import { Link, useHistory, useModel } from 'umi';
import { IconFont } from '@/const';
import LogoColor from '@/assets/logo/color.svg';
import './index.less';

const EditMenu = () => {
  const history = useHistory();

  const { activeTab, setActiveTab } = useModel('switchEditTab');

  return (
    <div className="edit-menu">
      <nav className="edit-nav">
        <div className="edit-menu-logo">
          <img src={LogoColor} onClick={() => history.push('/')} />
        </div>
        <div className="edit-menu-list">
          {MENU_EDIT.map((item) => {
            return (
              <div
                key={item.id}
                className={`edit-menu-item ${
                  activeTab === item.id ? 'active-item' : ''
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="edit-menu-icon">
                  <IconFont type={item.icon} style={{ fontSize: '18px' }} />
                </div>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default EditMenu;
