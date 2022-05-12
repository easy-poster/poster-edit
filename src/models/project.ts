import * as prjService from '@/services/project';

export default {
  namespace: 'project',
  state: {
    loading: false,
    prj: {},
    layeres: [],
  },
  reducers: {
    save(state, { payload: { prj, layeres, loading } }) {
      return { ...state, loading, prj, layeres };
    },
    saveLayeres(state, { payload: { layeres } }) {
      return { ...state, layeres };
    },
  },
  effects: {
    *getPrj({ payload: { uuid } }, { call, put }) {
      const project = yield call(prjService.getProject, { uuid });
      let prj = {};
      let layeres = [];
      for (let key in project) {
        if (key === 'layeres') {
          layeres = project[key];
          continue;
        }
        if (key === 'resources') continue;
        prj[key] = project[key];
      }
      yield put({
        type: 'save',
        payload: {
          prj,
          layeres,
        },
      });
    },
    *updateLayer({ payload: { id, uuid, newLayeres } }, { call, put }) {
      console.log('id', id);
      const updated = yield call(prjService.updateLayeres, { id, newLayeres });
      if (updated) {
        const project = yield call(prjService.getProject, { uuid });
        let layeres = project.layeres;
        yield put({
          type: 'saveLayeres',
          payload: {
            layeres,
          },
        });
      }
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
  subscriptions: {
    setup({ dispatch, history }) {
      // return history.listen(({ pathname, query }) => {
      //   if (pathname === '/users') {
      //     dispatch({ type: 'fetch', payload: query });
      //   }
      // });
    },
  },
};
function* takeLatest(
  getPrj: (
    {
      payload: { id },
    }: { payload: { id: any } },
    { call, put }: { call: any; put: any },
  ) => Generator<any, void, unknown>,
  arg1: { id: any },
) {
  throw new Error('Function not implemented.');
}
