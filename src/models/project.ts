import * as prjService from '@/services/project';
import { epProject } from '@/utils/db';

export type ProjectModalState = {
    id: string;
    uuid: string;
    createTime?: Date;
    updateTime?: Date;
    title: string;
    description: string;
    content: string;
    cover: string;
    width: number;
    height: number;
    background: string;
};

const initialState: ProjectModalState = {
    id: '',
    uuid: '',
    createTime: undefined,
    updateTime: undefined,
    title: '',
    description: '',
    content: '',
    cover: '',
    width: 0,
    height: 0,
    background: '',
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
    },
    effects: {
        *getPrj({ payload: { id } }, { call, put }) {
            const prj = yield call(prjService.getProjectDetail, { id });
            yield put({
                type: 'setState',
                payload: prj,
            });
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
