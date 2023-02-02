import React from 'react';
import { IconFont } from '@/const';
import styles from './index.less';

const BrandBanner = React.memo(() => {
    return (
        <div className={styles.brandBanner}>
            <h4>品牌工具箱为您的作品打上独一无二的标记</h4>
            <ul className={styles.bannerList}>
                <li className={styles.bannerLi}>
                    <IconFont
                        type="icon-duigou"
                        style={{ fontSize: '26px', color: '#5fd5a0' }}
                    />
                    <span className={styles.liContent}>
                        上传您独特的品牌logo、字体和颜色
                    </span>
                </li>
                <li className={styles.bannerLi}>
                    <IconFont
                        type="icon-duigou"
                        style={{ fontSize: '26px', color: '#5fd5a0' }}
                    />
                    <span className={styles.liContent}>
                        更简单的方式保持品牌一致性
                    </span>
                </li>
                <li className={styles.bannerLi}>
                    <IconFont
                        type="icon-duigou"
                        style={{ fontSize: '26px', color: '#5fd5a0' }}
                    />
                    <span className={styles.liContent}>轻松改变品牌吸引力</span>
                </li>
            </ul>
            <div className={styles.bannerBtn}>
                构建您的品牌效应
                <IconFont
                    type="icon-youjiantou"
                    style={{
                        fontSize: '30px',
                        marginLeft: 10,
                        color: '#FFF',
                    }}
                />
            </div>
        </div>
    );
});

export default BrandBanner;
