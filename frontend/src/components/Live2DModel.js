import React, { useEffect } from 'react';
import { loadLive2DScripts, initLive2DModel } from './live2dLoader';

const Live2DModel = () => {
  useEffect(() => {
    loadLive2DScripts().then(() => initLive2DModel());
  }, []);

  return <div id="live2d-container" style={{ position: 'fixed', right: 0, bottom: 0, width: '25%', height: '25%' }} />;
};

export default Live2DModel;
