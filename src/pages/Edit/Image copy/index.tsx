import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AutoComplete, SelectProps } from 'antd';
import demoImg from '@/assets/demo.png';
import './index.less';
import { IconFont } from '@/const';
import { useSize } from 'ahooks';
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll';
import BScroll from '@better-scroll/core';

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

const ImagePage = () => {
  const LIST = useMemo(() => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        title: `slider${i}`,
        width: 150 + i * 2,
        cover: demoImg,
      });
    }
    return arr;
  }, []);

  const swiperRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const size = useSize(swiperRef);

  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  useEffect(() => {
    let wrapper = document.querySelector('.swiper-wrap');
    if (wrapper) {
      bscrollObj = new BScroll(wrapper, {
        scrollX: true,
        probeType: 3,
      });
    }
  }, [size]);

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

  const handleDetail = (data: any) => {
    console.log('add', data);
  };

  return (
    <div className="image-wrap">
      <div className="search-wrap">
        <AutoComplete
          dropdownClassName="image-search-wrap"
          // dropdownMatchSelectWidth={252}
          style={{ width: '100%' }}
          allowClear
          backfill
          options={options}
          onSelect={onSelect}
          onSearch={handleSearch}
          placeholder="搜索图像"
        ></AutoComplete>
      </div>
      <div className="search-img-list">
        <div className="pre-item">
          <div className="pre-title">images demo</div>
          <div className="pre-list">
            <div className="swiper-wrap" ref={swiperRef}>
              <ul className="swiper-content">
                {LIST.map((item) => (
                  <li
                    className="swiper-item"
                    key={item.title}
                    style={{ width: item.width }}
                  >
                    <div className="item_img">
                      <img src={item.cover} alt={item.title} />
                    </div>
                    <div
                      className="img-btn edit-add"
                      onClick={() => handleDetail(item)}
                    >
                      <IconFont
                        type="icon-gengduo"
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div
                className="swiper-btn right-btn"
                ref={rightRef}
                onClick={() => handleTransform('R')}
              >
                <IconFont type="icon-xiangyou" style={{ fontSize: '24px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
