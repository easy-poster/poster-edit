import { useSetState } from 'ahooks';

export default () => {
  const [projectState, setProjectState] = useSetState({});
  return [projectState, setProjectState];
};
