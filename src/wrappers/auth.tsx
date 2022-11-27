import { Redirect } from '@umijs/max';

export default (props: any) => {
    const { isLogin } = { isLogin: true }; // useAuth();
    if (isLogin) {
        return props.children;
    } else {
        return <Redirect to="/login" />;
    }
};
