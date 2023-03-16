import React, { useState, useContext } from 'react';
import { List } from 'antd';
import { ProjectListContext } from '../Container/ProjectListContainer';
import ProjectItem from './ProjectItem';
import styles from './index.less';

const ProjectList = React.memo(() => {
    const { projectList } = useContext(ProjectListContext);
    const [activeCard, setActiveCard] = useState<number>();
    console.log('projectList', projectList);

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
