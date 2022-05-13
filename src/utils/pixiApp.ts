import { ItemType, ItemTypeProps } from '@/const';
import * as PIXI from 'pixi.js';
import { Application, Sprite } from 'pixi.js';
import { epProject, imageSpriteProps, layerProps } from './db';
import tools from './tools';

type optionsProps = {
  loadType: PIXI.LoaderResource.LOAD_TYPE;
  xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE;
  metadata?: {
    mimeType: string;
  };
};

export interface resourcesProp {
  alias: string;
  source: string;
  options: optionsProps;
}

type containerType = 'STAGE' | 'GUIDE';

export interface PixiAppProps {
  _isResourcesExist(name: string): boolean;
  // addResources(app: PIXI.Application, resources: resourcesProp[]): Promise<resourcesProp[]>
  // getSprite(sprite: PIXI.Sprite);
  getContainer(app: Application, id: string): PIXI.DisplayObject;
  addNode(
    app: Application,
    item: imageSpriteProps,
    resources: PIXI.utils.Dict<PIXI.LoaderResource>[],
    index: number,
    container?: PIXI.Container & {
      type: containerType;
    },
  ): Promise<void>;
}

class PixiApp extends PIXI.Application implements PixiAppProps {
  allResources: {
    [propname: string]: resourcesProp;
  } = {};
  loader = PIXI.Loader.shared;
  ticker = PIXI.Ticker.shared;
  static callFuc = {
    parseItem: null,
  };

  constructor(prj: epProject) {
    let options = {
      width: prj.width, // default: 800 宽度
      height: prj.height, // default: 600 高度
      antialias: true, // default: false 反锯齿
      transparent: false, // default: false 透明度
      // resolution: window.devicePixelRatio,
      backgroundColor: +prj.background,
      autoDensity: true,
      autoStart: false,
    };
    super(options);

    // ticker init
    this.ticker.autoStart = false;
    this.ticker.maxFPS = prj.fps || 10;

    // 加载资源
    this.loadResources(this, prj).then(() => {
      this.parseProject(this, prj);
    });
  }

  static setCallback(type, callback) {
    if (type == 'parseItem') {
      PixiApp.callFuc.parseItem = callback;
    }
  }

  // ----资源---->
  // 资源是否存在
  _isResourcesExist(name: string) {
    if (this.allResources[name]) {
      return true;
    }
    return false;
  }

  // 添加资源
  addResources(resources: PIXI.utils.Dict<PIXI.LoaderResource>[]) {
    return new Promise<PIXI.utils.Dict<PIXI.LoaderResource>>(
      (resolve, reject) => {
        let tempResources = JSON.parse(JSON.stringify(resources));
        let _resources = [];
        if (Array.isArray(resources)) {
          _resources = [...resources];
        } else {
          _resources.push(resources);
        }
        resources.forEach(
          (resource: PIXI.utils.Dict<PIXI.LoaderResource>, id) => {
            if (
              !this.allResources[resource.alias] &&
              !this._isResourcesExist(resource.alias)
            ) {
              this.loader.add(
                resource.alias,
                resource.source,
                resource.options,
              );
            }
          },
        );

        this.loader.load((loader, resources) => {
          Object.assign(this.allResources, resources);
          loader.reset();
          for (let index in tempResources) {
            let resource = tempResources[index];
            let res = resources[resource.alias];
            console.log('加载完成：', resource.alias);
            if (res) {
              switch (res.type) {
                case PIXI.LoaderResource.TYPE.IMAGE:
                  break;
                case PIXI.LoaderResource.TYPE.TEXT:
                  break;
                case PIXI.LoaderResource.TYPE.JSON:
                  break;
                case PIXI.LoaderResource.TYPE.AUDIO:
                  break;
                case PIXI.LoaderResource.TYPE.JSON:
                  break;
                case PIXI.LoaderResource.TYPE.XML:
                  break;
                case PIXI.LoaderResource.TYPE.UNKNOWN:
                  console.log(
                    'load UNKNOWN, name:' + name + ', time:' + Date.now(),
                  );
                  break;
                default:
                  break;
              }
            }
          }
          resolve(resources);
        });
      },
    );
  }

  // 删除资源
  delResources(data: { type: string; id: any }) {
    let resources = this.allResources;
    if (data.type === ItemType.IMAGE) {
      delete resources[`${data.id}_v`];
    } else if (data.type === ItemType.AUDIO) {
      delete resources[`${data.id}`];
      // delete soundes[`${data.id}`];
    }
  }

  // 加载资源
  loadResources(app: any, options: epProject) {
    if (this.loader) {
      this.loader.reset();
    }
    // 资源加载器
    return new Promise((resolve, reject) => {
      // 检查资源
      options.resources.forEach((resource, id) => {
        if (!this._isResourcesExist(resource.alias)) {
          this.loader.add(resource.alias, resource.source, resource.options);
        }
      });

      this.loader.load((loader, resources) => {
        Object.assign(this.allResources, resources);
        loader.reset();
        for (let name in resources) {
          let res = resources[name];
          switch (res.type) {
            case PIXI.LoaderResource.TYPE.IMAGE:
              break;
            case PIXI.LoaderResource.TYPE.TEXT:
              break;
            case PIXI.LoaderResource.TYPE.JSON:
              break;
            case PIXI.LoaderResource.TYPE.AUDIO:
              break;
            case PIXI.LoaderResource.TYPE.JSON:
              break;
            case PIXI.LoaderResource.TYPE.XML:
              break;
            case PIXI.LoaderResource.TYPE.UNKNOWN:
              console.log(
                'load UNKNOWN, name:' + name + ', time:' + Date.now(),
              );
              break;
            default:
              break;
          }
        }
        resolve(app);
      });
    });
  }
  // <----资源----

  // 解析项目数据
  parseProject(app: PIXI.Application, options: epProject) {
    let container: PIXI.Container & {
      type?: containerType;
    } = new PIXI.Container();
    container.sortableChildren = true;
    container.type = 'STAGE';
    const layeres = options.layeres || [];
    const layeresCount = layeres.length;
    for (let index = 0; index < layeresCount; index++) {
      let layer = layeres[index];
      let sprite = this.parseItem(app, layer, index + 10);
      if (sprite) {
        container.addChild(sprite);
      } else {
        console.log(`${layer.name} no texture`);
      }
    }
    app.stage.addChild(container);
    app.render();
  }

  // 精灵纹理解析
  parseItem(app: any, item: imageSpriteProps, zIndex: number) {
    let url, texture, sprite;
    switch (item.type) {
      case ItemType.IMAGE:
        if (item.from === 'url') {
          url = item.src;
          texture = PIXI.Texture.from(url);
        } else {
          if (this.allResources[item.id]) {
            texture = this.allResources[item.id].texture;
          }
        }
        if (texture) {
          sprite = new PIXI.Sprite(texture);
          sprite.interactive = true;
          sprite.buttonMode = true;
        }
        break;
      case ItemType.TEXT:
        // sprite = new PIXI.Text(item.content, item.style);
        break;
      default:
        console.warn('unsuppport');
        break;
    }
    if (sprite) {
      sprite.id = item.id;
      sprite.type = item.type;
      sprite.title = item.name;
      sprite.anchor.set(0.5, 0.5);
      sprite.x = item.left;
      sprite.y = item.top;
      sprite.width = item.width;
      sprite.height = item.height;
      sprite.rotation = item.rotation || 0;
      sprite.alpha = item.alpha || 1;
      sprite.zIndex = zIndex;
      sprite.visible = true;
      // 处理滤镜
      // if (item.filters) {
      //   this.parseFilters(sprite, item.filters);
      // }

      // 添加精灵监听
      if (PixiApp.callFuc.parseItem) {
        PixiApp.callFuc.parseItem(item, sprite);
      }
    }
    return sprite;
  }

  // parseFilters(sprite: PIXI.Sprite, filters: any[]) {
  //   if (filters && filters.length > 0) {
  //     let resources = this.allResources;
  //     let filter: { type: any; id: any; uniforms: {}; };
  //     filters.forEach(function (f: { type: any; id: string | number; param: { [x: string]: any; }; }, id: any) {
  //       switch (f.type) {
  //         case "3dlut":
  //           if(resources[f.id] && resources[f.id].texture){
  //             filter = new PIXI.filters.Color3dlutFilter(resources[f.id].texture);
  //             filter.type = f.type;
  //             filter.id = f.id;
  //           }
  //           break;
  //         default:
  //           break;
  //       }

  //       let uniforms = {};
  //       if (f.param) {
  //         for (let prop in f.param) {
  //           console.log(prop + ": " + f.param[prop]);
  //           uniforms[prop] = f.param[prop];
  //         }
  //       }

  //       if (filter) {
  //         filter.uniforms = uniforms;
  //         // Add the filter
  //         if (sprite.filters) {
  //           sprite.filters.push(filter);
  //         } else {
  //           sprite.filters = [filter];
  //         }
  //       }
  //     });
  //   }
  // }

  // 更新滤镜
  update3dlutFilter(
    sprite: { filters: string | any[] },
    filterId: any,
    lutId: string | number,
  ) {
    //判断类型是否一致
    if (sprite && sprite.filters) {
      let resources = this.allResources;
      for (let i = 0; i < sprite.filters.length; i++) {
        if (
          sprite.filters[i].id === filterId &&
          sprite.filters[i].type === '3dlut'
        ) {
          sprite.filters[i].id = lutId;
          sprite.filters[i].color3dlut = resources[lutId].texture;
          break;
        }
      }
    }
  }

  //删除滤镜
  removeFilter(sprite: { filters: any[] }, filterId: any) {
    if (sprite && sprite.filters) {
      for (let i = 0; i < sprite.filters.length; i++) {
        if (sprite.filters[i].id === filterId) {
          sprite.filters.splice(i, 1);
          break;
        }
      }
    }
  }

  // 关闭项目
  closeProject(app) {
    this.allResources = {};
    window.app = null;
  }

  // container
  getContainer(app: any, type: ItemTypeProps) {
    return app.stage.children.find((it) => {
      return it.type === type;
    });
  }

  // 添加
  addNode(
    app: Application,
    item: imageSpriteProps,
    resources: PIXI.utils.Dict<PIXI.LoaderResource>[],
    index: number,
    container?: PIXI.Container & {
      type?: containerType;
    },
  ) {
    return new Promise((resolve, reject) => {
      if (!app) {
        reject();
      }
      if (!container) {
        container = new PIXI.Container();
        container.sortableChildren = true;
        container.type = 'STAGE';
        app.stage.addChild(container);
      }
      if (container) {
        this.addResources(resources)
          .then(() => {
            let nodeSprite;
            nodeSprite = this.parseItem(app, item, index);
            if (nodeSprite) {
              container.addChild(nodeSprite);
              app.render();
              resolve(nodeSprite);
            }
          })
          .catch(() => {
            reject();
          });
      }
    });
  }

  // 更新
  updateNode() {}

  // 删除
  removeNode() {}

  // render渲染相关
  // start
  start(app: PIXI.Application, start = 0) {
    this.ticker.add((delta) => {
      let containers = app.stage.children;
      if (containers) {
        containers.forEach((item) => {
          if (item.isSprite) {
            if (item.type === 'IMAGE') {
              this.renderImage(item);
            }
          }
        });
      }
    });
  }

  renderImage(sprite) {
    if (sprite.filters) {
      sprite.filters.forEach(function (filter, id) {
        switch (filter.id) {
          case '':
            break;
          default:
        }
      });
    }
    if (!sprite.visible) {
      sprite.visible = true;
    }
  }
}

export default PixiApp;
