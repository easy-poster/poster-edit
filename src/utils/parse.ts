import { ItemType, ItemTypeProps } from '@/const';
import * as PIXI from 'pixi.js';
import { epProject, imageSpriteProps, layerProps } from './db';

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

interface PixiAppProps {
  _initApp(prj: epProject): PIXI.Application;
  _isResourcesExist(name: string): boolean;
  // addResources(app: PIXI.Application, resources: resourcesProp[]): Promise<resourcesProp[]>
}

class PixiApp extends PIXI.Application implements PixiAppProps {
  allResources: {
    [propname: string]: resourcesProp;
  } = {};
  loader = PIXI.Loader.shared;
  constructor(prj: epProject) {
    super();
    this._initApp.call(this, prj);
  }

  // 初始化pixi
  _initApp(prj: epProject) {
    let options = {
      width: prj.width, // default: 800 宽度
      height: prj.height, // default: 600 高度
      antialias: true, // default: false 反锯齿
      transparent: false, // default: false 透明度
      resolution: window.devicePixelRatio,
      backgroundColor: 0xff0000, // || +prj.background,
      autoDensity: true,
      autoStart: false,
    };
    const app = new PIXI.Application(options);
    // 加载资源
    this.loadResources(app, prj).then(() => {
      this.parseProject(app, prj);
    });
    return app;
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
  addResources(resources: resourcesProp[]) {
    return new Promise<resourcesProp[]>((resolve, reject) => {
      let tempResources = JSON.parse(JSON.stringify(resources));
      let _resources = [];
      if (Array.isArray(resources)) {
        _resources = [...resources];
      } else {
        _resources.push(resources);
      }
      resources.forEach((resource: resourcesProp, id) => {
        if (
          !this.allResources[resource.alias] &&
          !this._isResourcesExist(resource.alias)
        ) {
          this.loader.add(resource.alias, resource.source, resource.options);
        }
      });

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
    });
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
    // 检查资源
    // 资源加载器
    return new Promise((resolve, reject) => {
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
    const layeres = options.layeres || [];
    const layeresCount = layeres.length;
    for (let index = layeres.length - 1; index > -1; index--) {
      let layer = layeres[index];
      let row_Index = (layeresCount - index) * 1000;
      let container: PIXI.Container & {
        type?: ItemTypeProps;
        id?: string;
      };
      switch (layer.type) {
        case ItemType.IMAGE:
          container = this.parseImage(app, layer, row_Index);
          if (container) {
            container.type = layer.type;
            container.id = layer.id;
            app.stage.addChild(container);
          }
          break;
        case ItemType.LOGO:
          container = this.parseImage(app, layer, row_Index);
          if (container) {
            container.type = layer.type;
            container.id = layer.id;
            app.stage.addChild(container);
          }
          break;
        case ItemType.TEXT:
          break;
        case ItemType.AUDIO:
          break;
        default:
          break;
      }
    }
  }

  // 解析图片
  parseImage(app: any, layer: layerProps, row_Index: number) {
    let container = new PIXI.Container();
    container.sortableChildren = true;
    let child = layer.child;
    const childCount = child.length;
    for (let i = childCount - 1; i > -1; i--) {
      let item = child[i];
      let zIndex = row_Index + (childCount - i) * 10;
      let sprite = this.parseItem(app, item, zIndex);
      if (sprite) {
        container.addChild(sprite);
      } else {
        console.log(`${item.name} no texture`);
      }
    }
    return container;
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

  // 添加
  addNode(app, item, resources, index, container) {
    if (!app) return false;
    if (!container) {
      container = new PIXI.Container();
      container.sortableChildren = true;
      container.id = `${item.parentId}`;
      container.type = item.type;
      app.stage.addChild(container);
    }
    return new Promise<void>((resolve, reject) => {
      this.addResources(resources).then(() => {
        let nodeSprite;
        let zIndex = 0;
        let containers = container.children;
        let prevContainersLength = containers.length;
        if (index > containers.length || index < 0) return;
        containers.forEach(function (it, id) {
          if (id >= index) {
            if (id == index) {
              zIndex = it.zIndex;
            }
            it.zIndex = it.zIndex + 10;
          }
        });
        nodeSprite = this.parseItem(app, item, zIndex);
        if (nodeSprite) {
          container.addChild(nodeSprite);
        }
        resolve();
      });
    });
  }

  // 更新
  updateNode() {}

  // 删除
  removeNode() {}
}

export default PixiApp;
