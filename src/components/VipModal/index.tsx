import React, { useState, useEffect } from 'react';
import { Divider, Modal } from 'antd';
import { useModel } from '@umijs/max';
import QRCode from 'qrcode.react';
import { IconFont } from '@/const';
import './index.less';

const VIPLIST = [
    {
        id: 1,
        title: '基础版',
        money: '免费',
        package: ['最高480p导出', '一天最多导出5次'],
    },
    {
        id: 2,
        title: '创作版',
        money: '19',
        package: ['最高1080p导出', '无限导出', '全部滤镜选择', '全部贴纸选择'],
    },
    {
        id: 3,
        title: '商业版',
        money: '29',
        package: ['最高1080p导出', '无限导出', '全部滤镜选择', '全部贴纸选择', '品牌套件'],
    },
];

interface VipModalProps {
    visible: boolean;
}

const VipModal = ({ visible }: VipModalProps) => {
    const [activePkg, setActivePkg] = useState(0);

    const { setShowBuy } = useModel('buy');
    const handleCancel = () => {
        setShowBuy(false);
    };

    useEffect(() => {
        setActivePkg(1);
    }, []);

    const [isShowPay, setIsShowPay] = useState(false);
    const [currentMoney, setCurrentMoney] = useState(0);
    const handleChoice = (item: any) => {
        setCurrentMoney(item.money);
        setIsShowPay(true);
    };

    const handlePayCancel = () => {
        setIsShowPay(false);
    };

    return (
        <Modal
            wrapClassName="vip-modal"
            closeIcon={<IconFont type="icon-chacha" style={{ fontSize: '28px', color: '#000' }} />}
            width={'100%'}
            footer={null}
            visible={visible}
            onCancel={handleCancel}
        >
            <h3 className="title">选择你的方案</h3>
            <div className="vip-content">
                <div className="vip-list">
                    {VIPLIST.map((item) => {
                        return (
                            <div
                                className={`vip-item ${activePkg >= item.id ? '' : 'un-active'}`}
                                key={item.id}
                                onClick={() => handleChoice(item)}
                            >
                                <div>
                                    <div className="type">{item.title}</div>
                                    <div className="money">￥{item.money}/月</div>
                                    <div className="package">
                                        {item.package.map((it) => {
                                            return (
                                                <div className="package-item" key={it}>
                                                    <IconFont
                                                        type="icon-duigou"
                                                        style={{
                                                            fontSize: '26px',
                                                            color: '#5fd5a0',
                                                        }}
                                                    />
                                                    <span className="text">{it}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {activePkg === item.id ? (
                                    <div className="btn">当前套餐</div>
                                ) : (
                                    <div className="btn active">选择</div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* <p>免费试用7天，可随时取消！</p> */}
                <Modal
                    wrapClassName="pay-modal"
                    closeIcon={
                        <IconFont type="icon-chacha" style={{ fontSize: '28px', color: '#000' }} />
                    }
                    width={500}
                    footer={null}
                    visible={isShowPay}
                    getContainer={false}
                    onCancel={handlePayCancel}
                >
                    <div className="pay-wrap">
                        <Divider className="divider-line" dashed />
                        <div className="qrcode-wrap">
                            <div className="qrcode">
                                <QRCode
                                    value="asdawd22345g45g5g6grgsdfsdfsdf3de"
                                    size={200}
                                    level="Q"
                                    // imageSettings={{
                                    //   src: ''
                                    // }}
                                />
                            </div>
                            <div className="pay-right">
                                <div className="pay-money">
                                    付费金额：<span>¥{currentMoney}</span>
                                </div>
                                <div className="pay-type">
                                    <IconFont type="icon-weixin" style={{ fontSize: '24px' }} />
                                    <IconFont
                                        type="icon-zhifubao"
                                        style={{ fontSize: '24px', marginLeft: 5, marginRight: 10 }}
                                    />
                                    微信或支付宝扫码支付
                                </div>
                            </div>
                        </div>
                        <Divider className="divider-line" dashed />
                        <p className="tips">
                            订阅即表示你同意
                            <a href="#">eposter使用条款</a>和<a href="#">自动续订服务</a>
                        </p>
                    </div>
                </Modal>
            </div>
        </Modal>
    );
};

export default VipModal;
