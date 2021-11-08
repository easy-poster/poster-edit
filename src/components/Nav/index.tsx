import React from 'react';
import { history } from 'umi';
import SearchHeader from '../SearchHeader';
import './index.less';

const Nav = () => {
  const handleNewProject = () => {
    history.push(`/edit/${new Date().getTime()}`);
  };

  return (
    <header className="header">
      <div className="flex flex-row justify-between header-content">
        <SearchHeader />
        <div className="header-right flex">
          <div className="rounded-full cursor-pointer bg-gray-50 px-9 py-3 mr-2 hover:bg-gray-200 upgrade-btn">
            升级
          </div>
          <div
            className="rounded-full cursor-pointer bg-gray-50 px-9 py-3 mr-2 hover:bg-gray-200 header-create"
            onClick={handleNewProject}
          >
            新建海报
          </div>
          <div className="rounded-full cursor-pointer bg-gray-50 p-3 hover:bg-gray-200 header-user">
            user
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
