import { Application } from '@pixi/app';
import { AbstractRenderer, Renderer } from '@pixi/core';
import { createLogger } from 'redux-logger';
import { message } from 'antd';

export const dva = {
  config: {
    onAction: createLogger(),
    onError(e: Error) {
      message.error(e.message, 3);
    },
  },
};

interface initRenderer extends Renderer {
  autoResize: boolean;
}

interface initApplication extends Application {
  renderer: initRenderer;
}

export interface initApp {
  app: initApplication | null;
}
