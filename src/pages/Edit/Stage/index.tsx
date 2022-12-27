import React from 'react';
import { useSelector } from '@umijs/max';
import Canvas from './canvas/Canvas';
import Loading from './loading';

const Stage: React.FC = () => {
  const projectState = useSelector((state: { project: any }) => {
    return state.project;
  });

  return projectState?.uuid ? (
    <Canvas projectInfo={projectState} />
  ) : (
    <Loading />
  );
};

export default Stage;
