import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
    useContext,
} from 'react';
import { Button, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IconFont } from '@/const';
import { ProjectListContext } from '../Container/ProjectListContainer';
import ProjectItem from './ProjectItem';
import styles from './index.less';

const ProjectList = React.memo(() => {
    const { projectList, pageTotal, currentPage, setCurrentPage } =
        useContext(ProjectListContext);
    const [activeCard, setActiveCard] = useState('');

    return (
        <div className={styles.projectContent}>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 2,
                    xl: 3,
                    xxl: 4,
                }}
                dataSource={projectList}
                renderItem={(item) => (
                    <ProjectItem
                        item={item}
                        activeCard={activeCard}
                        setActiveCard={setActiveCard}
                    />
                )}
            />
        </div>
    );
});

export default ProjectList;
