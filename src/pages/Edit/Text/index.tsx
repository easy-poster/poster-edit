import React, { useMemo, useState } from 'react';
import demoImg from '@/assets/demo.png';
import './index.less';
import { IconFont, TextDefData } from '@/const';
import { AutoComplete, message, SelectProps } from 'antd';
import { useSelector } from 'umi';

function getRandomInt(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

const searchResult = (query: string) =>
  new Array(getRandomInt(5))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });

const TextPage = () => {
  const projectState = useSelector((state) => {
    return state.project.prj;
  });

  const layeres = useSelector((state) => {
    return state.project.layeres;
  });

  const LIST = useMemo(() => {
    let arr = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        id: i,
        title: `slider${i}`,
        cover: demoImg,
      });
    }
    return arr;
  }, []);

  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  const handleAdd = (data: any) => {
    if (window.handler) {
      window.handler.add({ type: 'textbox', text: data });
    }
    return;

    console.log('data', data);
    if (!window.app && Object.keys(projectState).length !== 0) {
      message.warning('项目正在初始化');
      return false;
    }
    let result = {
      ...TextDefData,
      id: `${new Date().getTime()}_t`,
      name: data,
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
        align: 'center',
      },
      left: projectState.width / 2,
      top: projectState.height / 2,
    };
    const objectContainer = window.app.getContainer(window.app, 'STAGE');
    window.app
      .addNode(window.app, result, null, layeres.length + 10, objectContainer)
      .then(async (sprite) => {});
  };

  return (
    <div className="text-wrap">
      <div className="text-search">
        <AutoComplete
          dropdownClassName="image-search-wrap"
          // dropdownMatchSelectWidth={252}
          style={{ width: '100%' }}
          allowClear
          backfill
          options={options}
          onSelect={onSelect}
          onSearch={handleSearch}
          placeholder="搜索文字"
        ></AutoComplete>
        <div className="text-nomal" onClick={() => handleAdd('添加一段文本')}>
          添加一段文本
        </div>
      </div>
      <div className="text-list">
        {LIST.map((item) => {
          return (
            <div className="img-item" key={item.id}>
              <div className="img-wrap">
                <img className="img-cover" alt="example" src={item.cover} />
                <div
                  className="img-btn edit-add"
                  onClick={() => handleAdd(item)}
                >
                  <IconFont
                    type="icon-tianjia_huaban"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
              <p className="title">{item.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TextPage;
