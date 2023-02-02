import React, { useContext } from 'react';
import BrandList from '../BrandList';
import Color from '../color';
import BrandBanner from '../components/BrandBanner';
import { BrandContext } from '../container';
import Font from '../font';
import Logo from '../logo';
import NewKitModal from '../Modal/NewKit';

/**
 * @description 品牌工具箱
 */
const Kit = React.memo(() => {
    const { isHaveKit } = useContext(BrandContext);

    return isHaveKit ? (
        <>
            <NewKitModal />
            <BrandList />
        </>
    ) : (
        <>
            <NewKitModal />
            <BrandBanner />
            <Logo />
            <Color />
            <Font />
        </>
    );
});

export default Kit;
