export interface UserModelState {
    userId: number;
    nickName: string;
    age: number;
    birthday: Date;
    phone: number;
    email: string;
}

const initialState: UserModelState = {
    userId: 100000,
    nickName: 'momo',
    age: 25,
    birthday: new Date('1997/02/09'),
    phone: 18408289351,
    email: '418788724@qq.com',
};

export default {
    namespace: 'user',
    state: initialState,
    reducers: {
        setState(state = initialState, { payload }: any) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
