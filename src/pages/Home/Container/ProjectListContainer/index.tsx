import { epProject } from '@/utils/db';
import { getProjectList } from '@/services/project';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ProjectListContextProps {
    projectList: epProject[];
    getProject: () => void;
}

export const ProjectListContext = React.createContext<ProjectListContextProps>(
    null as any,
);

const ProjectListContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const [projectList, setProjectList] = useState<epProject[]>([]);
    // const [isLoading, setIsLoading] = useState(false);

    const getProject = useCallback(async () => {
        // setIsLoading(true);
        try {
            let res = await getProjectList();
            setProjectList(res);
        } catch (error) {
        } finally {
            // setIsLoading(false);
        }
    }, []);

    const memoCtx = useMemo(() => {
        return {
            projectList,
            getProject,
        };
    }, [projectList]);

    useEffect(() => {
        getProject();
    }, []);

    return (
        <ProjectListContext.Provider value={memoCtx}>
            {children}
        </ProjectListContext.Provider>
    );
});

export default ProjectListContainer;
