import Core, { Iplugin } from '../core';

class Plugin1 implements Iplugin {
  name = 'BLock1';
  fn(ctx: Core) {
    console.log('插件1', ctx);
  }
}

export default Plugin1;
