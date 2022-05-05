import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, history, useModel } from 'umi';
import { useSize } from 'ahooks';
import { Input, AutoComplete, Select, List, Card, Menu, Dropdown } from 'antd';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import { SelectProps } from 'antd/es/select';
import BScroll from '@better-scroll/core';
import { IconFont } from '@/const';
import demoImg from '@/assets/demo.png';
import noImage from '@/assets/noImage.jpeg';
import dayjs from 'dayjs';
import { db } from '@/utils/db';
import './index.less';

const { Option } = Select;

let bscrollObj: BScrollConstructor<{}>;

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

const Home = () => {
  const swiperRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const size = useSize(swiperRef);
  const [activeCard, setActiveCard] = useState('');

  const LIST = useMemo(() => {
    let arr = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        title: `slider${i}`,
        cover: demoImg,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    let wrapper = document.querySelector('.swiper-wrap');
    if (wrapper) {
      bscrollObj = new BScroll(wrapper, {
        scrollX: true,
        probeType: 3,
      });
    }
  }, []);

  const handleTransform = (to: string) => {
    console.log('to', to, bscrollObj, size);
    if (bscrollObj && size.width) {
      if (to === 'L') {
        if (bscrollObj.x === bscrollObj.minScrollX) {
          bscrollObj.scrollBy(size.width * 0.1, 0, 300);
        } else {
          bscrollObj.scrollBy(size.width * 0.7, 0, 300);
        }
      } else {
        if (bscrollObj.x === bscrollObj.maxScrollX) {
          bscrollObj.scrollBy(-size.width * 0.1, 0, 300);
        } else {
          bscrollObj.scrollBy(-size.width * 0.7, 0, 300);
        }
      }
    }
  };

  // 最近作品
  const [project, setProject] = useState([]);
  const getProject = async () => {
    let result = [];
    result = await db.epProject
      .where({
        userId: 1,
      })
      .reverse()
      .sortBy('id');

    setProject(result);
  };

  useEffect(() => {
    getProject();
  }, []);

  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  const handleGoEdit = (e, item: any) => {
    console.log('去编辑，要防抖', item);
    if (item.uuid) {
      history.push(`/edit/${item.uuid}`);
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    setActiveCard(id);
  };

  const handleDel = async (id: any) => {
    if (id) {
      try {
        let res = await db.epProject.where('id').equals(id).delete();
        if (res) {
          setActiveCard('');
          // 重新请求数据
          getProject();
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  const handleEditMenuClick = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    console.log('click on item', key);
    switch (+key) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        handleDel(+activeCard);
        break;

      default:
        break;
    }
  };

  const menu = () => {
    const items = [
      {
        label: '复制',
        key: 1,
        icon: <IconFont type="icon-fuzhi" style={{ fontSize: '22px' }} />,
      },
      {
        label: '下载',
        key: 2,
        icon: <IconFont type="icon-xiazai" style={{ fontSize: '22px' }} />,
      },
      {
        label: '删除',
        key: 3,
        icon: <IconFont type="icon-shanchu" style={{ fontSize: '22px' }} />,
      },
    ];
    return <Menu onClick={handleEditMenuClick} items={items} />;
  };

  return (
    <div className="home">
      <div className="swiper-title-wrap">
        <h3 className="swiper-title">你可能想尝试</h3>
        <span className="tips">更多</span>
      </div>
      <div className="swiper-wrap" ref={swiperRef}>
        <ul className="swiper-content">
          {LIST.map((item) => (
            <li className="swiper-item" key={item.title}>
              <div className="item_img">
                <img src={item.cover} alt={item.title} />
              </div>
              <p>{item.title}</p>
            </li>
          ))}
        </ul>
        <div
          className="swiper-btn left-btn"
          ref={leftRef}
          onClick={() => handleTransform('L')}
        >
          <IconFont type="icon-xiangzuo" style={{ fontSize: '24px' }} />
        </div>
        <div
          className="swiper-btn right-btn"
          ref={rightRef}
          onClick={() => handleTransform('R')}
        >
          <IconFont type="icon-xiangyou" style={{ fontSize: '24px' }} />
        </div>
      </div>
      <div className="myproject">
        <div className="title-wrap">
          <h3 className="swiper-title">最近的作品</h3>
          <div className="project-right">
            <AutoComplete
              dropdownClassName="card-search-wrap"
              dropdownMatchSelectWidth={252}
              style={{ width: 300 }}
              allowClear
              backfill
              options={options}
              onSelect={onSelect}
              onSearch={handleSearch}
              placeholder="最近作品"
            ></AutoComplete>
            <Select
              dropdownClassName="card-filter-wrap"
              dropdownMatchSelectWidth={false}
              placement="bottomRight"
              defaultValue="1"
              style={{ width: 100 }}
              bordered={false}
            >
              <Option value="1">最新</Option>
              <Option value="2">名称</Option>
              <Option value="3">大小</Option>
            </Select>
          </div>
        </div>
        <div className="project-content">
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 2,
              xl: 2,
              xxl: 3,
            }}
            dataSource={project}
            renderItem={(item) => (
              <List.Item>
                <div
                  className="card-item"
                  onClick={(e) => handleGoEdit(e, item)}
                >
                  <img
                    className="card-cover"
                    alt="example"
                    src={item.cover || noImage}
                  />
                  <Dropdown
                    overlayClassName="card-drop-wrap"
                    overlay={menu}
                    trigger={['click']}
                    onVisibleChange={(visible) => !visible && setActiveCard('')}
                    placement="bottomLeft"
                  >
                    <div
                      className={`${
                        activeCard === item.id ? 'active-edit' : 'card-edit'
                      }`}
                      onClick={(e) => handleEdit(e, item.id)}
                    >
                      <IconFont
                        type="icon-gengduo"
                        style={{ fontSize: '24px' }}
                      />
                    </div>
                  </Dropdown>
                  <div className="meta-wrap">
                    <h3>{item.title}</h3>
                    <p>
                      最后编辑：
                      {dayjs(item.updateTime).format('YYYY-MM-DD HH:mm')}
                    </p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
