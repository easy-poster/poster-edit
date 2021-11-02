import { Redirect } from 'umi';

export default (props: any) => {
  const { isLogin } = { isLogin: true }; // useAuth();
  if (isLogin) {
    return props.children;
  } else {
    return <Redirect to="/login" />;
  }
};
