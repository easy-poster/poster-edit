import { EventEmitter } from 'events';

export interface Iplugin {
  name: string;
  fn: (ctx: Core) => void;
}

class Core {
  pluginMap: Map<string, Iplugin> = new Map();
  events: EventEmitter = new EventEmitter();

  constructor() {
    this.events.emit('beforeInit');
    console.log('内核初始化');
    this.events.emit('afterInit');
  }

  use(plugin: Iplugin): Core {
    this.pluginMap.set(plugin.name, plugin);
    return this;
  }

  run() {
    this.events.emit('before all plugins');
    this.pluginMap.forEach((plugin) => {
      plugin.fn(this);
    });
    this.events.emit('after all plugins');
  }
}

export default Core;
