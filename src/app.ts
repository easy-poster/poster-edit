import { Application } from '@pixi/app';
import { AbstractRenderer, Renderer } from '@pixi/core';

interface initRenderer extends Renderer {
  autoResize: boolean;
}

interface initApplication extends Application {
  renderer: initRenderer;
}

export interface initApp {
  app: initApplication | null;
}

export async function getInitialState() {
  let init: initApp = {
    app: null,
  };
  return init;
}
