import React, { useContext } from 'react';
import { message } from 'antd';
import cn from 'classnames';
import BridgeController from '@/helper/bridge/BridgeController';
import { FabricObjectType, IconFont } from '@/const';
import styles from './index.less';
import { Resource } from '@/services/resource';
import { ResourceContext } from '../../container/ResourceContainer';

const UploadList = React.memo(() => {
    const { resourceList } = useContext(ResourceContext);

    const handleDel = async (item: any) => {
        if (item.id) {
            try {
            } catch (error) {
                console.log('error', error);
            }
        }
    };

    const handleAdd = (data: Resource) => {
        BridgeController.AddResource({
            id: data.id,
            type: FabricObjectType.IMAGE,
            src: data.url,
        });
    };

    return (
        <div className={styles.uploadList}>
            {resourceList.map((item) => {
                return (
                    <div className={styles.imgItem} key={item.uuid}>
                        <div className={styles.imgWrap}>
                            <img
                                className={styles.imgCover}
                                alt={item.name}
                                src={item.cover || item.url}
                            />
                            <div className={styles.editWrap}>
                                <div
                                    className={cn(
                                        styles.imgBtn,
                                        styles.editDel,
                                    )}
                                    onClick={() => handleDel(item)}
                                >
                                    <IconFont
                                        type="icon-shanchu"
                                        style={{ fontSize: '14px' }}
                                    />
                                </div>
                                <div
                                    className={cn(
                                        styles.imgBtn,
                                        styles.editAdd,
                                    )}
                                    onClick={() => handleAdd(item)}
                                >
                                    <IconFont
                                        type="icon-tianjia_huaban"
                                        style={{ fontSize: '16px' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <p className={styles.title}>{item.name}</p>
                    </div>
                );
            })}
        </div>
    );
});

export default UploadList;
