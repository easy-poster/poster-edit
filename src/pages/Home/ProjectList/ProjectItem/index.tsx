import React, { useCallback, useContext } from 'react';
import { history } from '@umijs/max';
import { Dropdown, MenuProps } from 'antd';
import errorImg from '@/assets/common/errorImg.svg';
import { IconFont } from '@/const';
import dayjs from 'dayjs';
import cn from 'classnames';
import { delProject, ProjectInfo } from '@/services/project';
import { ProjectListContext } from '../../Container/ProjectListContainer';
import styles from './index.less';

const items = [
    {
        label: '制作副本',
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

const ProjectItem = React.memo(
    ({
        item,
        activeCard,
        setActiveCard,
    }: {
        item: ProjectInfo;
        activeCard: string;
        setActiveCard: (str: string) => void;
    }) => {
        const { getProject } = useContext(ProjectListContext);

        const handleGoEdit = async (item: any) => {
            history.push(`/edit/${item.uuid}`);
        };

        const handleEdit = (
            e: React.MouseEvent<HTMLDivElement, MouseEvent>,
            id: string,
        ) => {
            e.stopPropagation();
            setActiveCard(id);
        };

        const handleOpenChange = (open: boolean) => {
            if (!open) {
                setActiveCard('');
            }
        };

        const handleDel = useCallback(async () => {
            if (!item.id) return;
            try {
                await delProject({
                    id: item.id,
                });
                await getProject();
            } catch (error) {
                console.log('error', error);
            }
        }, [item?.id]);

        const handleMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
            domEvent.stopPropagation();
            setActiveCard('');
            switch (+key) {
                case 1:
                    console.log('制作副本');
                    break;
                case 2:
                    console.log('下载');
                    break;
                case 3:
                    console.log('删除');
                    handleDel();
                    break;
                default:
                    break;
            }
        };

        return (
            <div className={styles.cardItem} onClick={() => handleGoEdit(item)}>
                <img
                    className={styles.cardCover}
                    alt="example"
                    src={item.cover || errorImg}
                />
                <Dropdown
                    overlayClassName="card-drop-wrap"
                    menu={{ items, onClick: handleMenuClick }}
                    trigger={['click']}
                    placement="bottomLeft"
                    destroyPopupOnHide={true}
                    onOpenChange={handleOpenChange}
                >
                    <div
                        className={cn(styles.cardEdit, {
                            [styles.activeEdit]: activeCard === item?.id,
                        })}
                        onClick={(e) => handleEdit(e, item.id)}
                    >
                        <IconFont
                            type="icon-gengduo"
                            style={{ fontSize: '24px' }}
                        />
                    </div>
                </Dropdown>
                <div className={styles.metaWrap}>
                    <h3 title={item.title}>{item.title}</h3>
                    <div className={styles.sub}>
                        <p>
                            上次编辑时间：
                            {dayjs(item.updateTime).format('YYYY/MM/DD HH:mm')}
                        </p>
                        <span>
                            {item.width} × {item.height}
                        </span>
                    </div>
                </div>
            </div>
        );
    },
);

export default ProjectItem;
