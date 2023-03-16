import { useDispatch } from '@umijs/max';
import { useParams } from '@umijs/max';
import React, { useEffect } from 'react';

/**
 * @description 项目信息容器
 */
const ProjectContainer = React.memo<React.PropsWithChildren>((props) => {
    const { children } = props;
    const params = useParams<{ id: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        if (params?.id) {
            dispatch({
                type: 'project/getPrj',
                payload: { uuid: params.id },
            });
        }

        return () => {
            // 重置project
            dispatch({
                type: 'project/resetState',
            });
        };
    }, [params?.id]);

    return <>{children}</>;
});

export default ProjectContainer;
