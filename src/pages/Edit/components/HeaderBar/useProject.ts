import { useCallback } from 'react';
import { useDispatch } from '@umijs/max';
import { useParams } from '@umijs/max';

export default function useProject() {
    const params = useParams<{ id: string }>();
    const dispatch = useDispatch();

    const getProjectHooks = useCallback(() => {
        if (params?.id) {
            dispatch({
                type: 'project/getPrj',
                payload: { uuid: params.id },
            });
        }
    }, []);

    return {
        getProjectHooks,
    };
}
