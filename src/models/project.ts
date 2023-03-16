import { epProject } from '@/utils/db';
import * as prjService from '@/services/project';
import { EffectsCommandMap } from '@umijs/max';

const initialState: epProject = {
    title: '',
    description: '',
    width: 0,
    height: 0,
    background: '',
    backgroundImage: '',
    id: 0,
    uuid: '',
};

export default {
    namespace: 'project',
    state: initialState,
    reducers: {
        setState(state = initialState, { payload }: any) {
            return {
                ...state,
                ...payload,
            };
        },
        resetState() {
            return {
                ...initialState,
            };
        },
    },
    effects: {
        *getPrj(
            {
                payload: { uuid },
            }: { payload: { uuid: Pick<epProject, 'uuid'> } },
            { call, put }: EffectsCommandMap,
        ): any {
            const prj = yield call(prjService.getProjectDetail, { uuid });
            yield put({
                type: 'setState',
                payload: prj,
            });
        },
        *updatePrj(
            { payload }: { payload: Omit<epProject, 'id' | 'uuid'> },
            { call, select }: EffectsCommandMap,
        ) {
            let { id } = yield select((state: { project: { id: any } }) => ({
                id: state.project.id,
            }));
            let data = {
                ...payload,
                id: id,
            };
            if (!id || !payload) return;
            yield call(prjService.updateProject, data);
        },
    },
};
