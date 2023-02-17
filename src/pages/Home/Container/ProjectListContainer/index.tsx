import { getProjectList, OrderTypes, ProjectInfo } from '@/services/project';
import { useModel } from '@umijs/max';
import { useDebounce, useDebounceEffect } from 'ahooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ProjectListContextProps {
    projectList: ProjectInfo[];
    getProject: () => void;
    currentPage: number;
    setCurrentPage: (val: number) => void;
    searchValue: string;
    setSearchValue: (val: string) => void;
    orderType: OrderTypes;
    setOrderType: (val: OrderTypes) => void;
    pageTotal: number;
}

export const ProjectListContext = React.createContext<ProjectListContextProps>(
    null as any,
);

const ProjectListContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;

    const { initialState } = useModel('@@initialState');

    const [projectList, setProjectList] = useState<ProjectInfo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [pageTotal, setPageTotal] = useState(0);
    const [orderType, setOrderType] = useState<OrderTypes>(OrderTypes.TIME);
    const debouncedsearchValue = useDebounce(searchValue, { wait: 300 });
    const [isLoading, setIsLoading] = useState(false);

    const getProject = useCallback(async () => {
        if (!initialState?.currentUser) return;
        setIsLoading(true);
        try {
            let res = await getProjectList({
                current: currentPage,
                pageSize: 20,
                search: debouncedsearchValue,
                orderType: orderType,
            });
            let list = res?.list || [];
            let total = res.total;
            setProjectList([...projectList, ...list]);
            setPageTotal(total);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, [
        initialState?.currentUser,
        currentPage,
        debouncedsearchValue,
        orderType,
    ]);

    const memoCtx = useMemo(() => {
        return {
            projectList,
            getProject,
            currentPage,
            setCurrentPage,
            searchValue,
            setSearchValue,
            orderType,
            setOrderType,
            pageTotal,
        };
    }, [projectList, currentPage, searchValue, orderType, pageTotal]);

    useEffect(() => {
        //获取滚动条当前的位置
        function getscrolltop() {
            let scrolltop = 0;
            if (
                document.documentElement &&
                document.documentElement.scrollTop
            ) {
                scrolltop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrolltop = document.body.scrollTop;
            }
            return scrolltop;
        }

        //获取当前可视范围的高度
        function getclientheight() {
            let clientheight = 0;
            if (
                document.body.clientHeight &&
                document.documentElement.clientHeight
            ) {
                clientheight = Math.min(
                    document.body.clientHeight,
                    document.documentElement.clientHeight,
                );
            } else {
                clientheight = Math.max(
                    document.body.clientHeight,
                    document.documentElement.clientHeight,
                );
            }
            return clientheight;
        }

        //获取文档完整的高度
        function getscrollheight() {
            let dom = document.querySelector('#home');
            let scrollHeight = 0;
            if (dom) {
                scrollHeight = Math.max(dom.scrollHeight, dom.scrollHeight);
            }
            return scrollHeight;
        }
        const handleScroll = () => {
            if (
                Math.round(getscrolltop() + getclientheight()) >=
                getscrollheight()
            ) {
                if (projectList.length < pageTotal && !isLoading) {
                    setCurrentPage(currentPage + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [projectList, pageTotal, currentPage, isLoading]);

    useEffect(() => {
        getProject();
    }, [
        initialState?.currentUser,
        currentPage,
        debouncedsearchValue,
        orderType,
    ]);

    return (
        <ProjectListContext.Provider value={memoCtx}>
            {children}
        </ProjectListContext.Provider>
    );
});

export default ProjectListContainer;
