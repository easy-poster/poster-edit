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
        // *remove({ payload: id }, { call, put }) {
        //   yield call(usersService.remove, id);
        //   yield put({ type: 'reload' });
        // },
        // *patch({ payload: { id, values } }, { call, put }) {
        //   yield call(usersService.patch, id, values);
        //   yield put({ type: 'reload' });
        // },
        // *create({ payload: values }, { call, put }) {
        //   yield call(usersService.create, values);
        //   yield put({ type: 'reload' });
        // },
        // *reload(action, { put, select }) {
        //   const page = yield select(state => state.users.page);
        //   yield put({ type: 'fetch', payload: { page } });
        // },
    },
};
