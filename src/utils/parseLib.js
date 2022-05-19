(function (PIXI, parseLib) {
  var callBacks = {
    parseItem: null,
    parsed: null,
    exportParsed: null,
    progress: null,
    exportProgress: null,
    stop: null,
    parseTransitioned: null,
    recordFinish: null,
    recordFail: null,
  }; //回调函数
  //转场渲染需要的对象
  var transitionRenderer = PIXI.autoDetectRenderer(); //渲染转场第二部分的渲染器
  var baseRenderTexture = new PIXI.BaseRenderTexture({
    width: 800,
    height: 600,
  });
  var renderTexture = new PIXI.RenderTexture(baseRenderTexture); //渲染转场第二部分的纹理
  let loader = PIXI.Loader.shared;
  window.allResources = {};
  //分析一个音频轨道,offline是否离线,mySound 为pixi-sound实例对象,duration音频总时长,track为音频轨道对象
  function parseAudio(mySound, duration, track) {
    //处理轨道中的每一个媒体文件
    let count = track.child.length;
    for (let i = 0; i < count; i++) {
      let child = track.child[i];
      //如果是视频轨道，或者虽然是视频轨道但是不是静音也需要解释其中的音频
      if (
        convertLowerCase(child.type) == 'audio' ||
        (convertLowerCase(child.type) == 'video' && child.volume > 0)
      ) {
        let sound;
        if (child.from === 'resource') {
          let name = child.id || child.name;
          if (convertLowerCase(child.type) == 'video') {
            name = name + '_a';
          }
          sound = mySound.find(name);
          if (sound) {
            //需要设置options,因为在offline为true时编码aac时用到options参数里面的when,start等值 2021-02-04
            sound.options = {
              when: child.startTime,
              start: child.whenStartTime,
              end: child.whenEndTime,
              speed: child.speed || 1,
              volume: child.volume ? child.volume : 1,
              loop: child.loop ? child.loop : 0,
              duration:
                child.whenEndTime - child.whenStartTime || child.originDuration,
              playDuration: child.whenEndTime - child.whenStartTime,
            };
            sound.speed = child.speed || 1;
            sound.isUse = true;
            if (child.volume / 1 !== 1) {
              sound.volume = child.volume;
            }
          }
        } else {
          if (!mySound._sounds[child.id]) {
            mySound.loading = mySound.loading + 1;
            sound = mySound.add(child.id || child.name, {
              materialId: child.materialId,
              url: child.src,
              preload: true,
              when: child.startTime,
              start: child.whenStartTime,
              end: child.whenEndTime,
              speed: child.speed || 1,
              volume: child.volume ? child.volume : 1,
              loop: child.loop ? child.loop : 0,
              duration: child.whenEndTime - child.whenStartTime,
              playDuration: child.whenEndTime - child.whenStartTime,
              loaded: function () {
                mySound.loaded = mySound.loaded + 1;
              },
            });
            sound.speed = child.speed || 1;
            sound.isUse = true;
            if (child.volume / 1 !== 1) {
              sound.volume = child.volume;
            }
          } else {
            sound = mySound.find(child.id);
            if (sound) {
              sound.options = {
                materialId: child.materialId,
                url: child.src,
                preload: true,
                when: child.startTime,
                start: child.whenStartTime,
                end: child.whenEndTime,
                speed: child.speed || 1,
                volume: child.volume ? child.volume : 1,
                loop: child.loop ? child.loop : 0,
                duration: child.whenEndTime - child.whenStartTime,
                playDuration: child.whenEndTime - child.whenStartTime,
              };
              sound.speed = child.speed || 1;
              sound.isUse = true;
              if (child.volume / 1 !== 1) {
                sound.volume = child.volume;
              }
            }
          }
        }

        if (sound) {
          let filters = [];
          var filter;
          const filtersCount = child.audioFilters
            ? child.audioFilters.length
            : 0;
          for (let f = 0; f < filtersCount; f++) {
            let name = child.audioFilters[f].name;
            if (name == '') continue;

            filter = new mySound.filters[name]();
            let param = child.audioFilters[f].param;
            for (prop in param) {
              if (
                typeof param[prop] == 'number' ||
                typeof param[prop] == 'boolean'
              )
                filter[prop] = param[prop];
            }

            filters.push(filter);
          }

          sound.filters = filters;
        }
      }
    }

    return mySound;
  }

  function parseVideoFilters(sprite, filters) {
    if (filters && filters.length > 0) {
      let resources = window.allResources;
      let filter;
      filters.forEach(function (f, id) {
        switch (f.type) {
          case '3dlut':
            if (resources[f.id] && resources[f.id].texture) {
              filter = new PIXI.filters.Color3dlutFilter(
                resources[f.id].texture,
              );
              filter.type = f.type;
              filter.id = f.id;
            }
            break;
          default:
            break;
        }

        let uniforms = {};
        if (f.param) {
          for (let prop in f.param) {
            console.log(prop + ': ' + f.param[prop]);
            uniforms[prop] = f.param[prop];
          }
        }

        if (filter) {
          filter.uniforms = uniforms;
          // Add the filter
          if (sprite.filters) {
            sprite.filters.push(filter);
          } else {
            sprite.filters = [filter];
          }
        }
      });
    }
  }

  //删除滤镜
  function removeVideoFilter(sprite, filterId) {
    if (sprite && sprite.filters) {
      for (let i = 0; i < sprite.filters.length; i++) {
        if (sprite.filters[i].id === filterId) {
          sprite.filters.splice(i, 1);
          break;
        }
      }
    }
  }

  /*
//更新滤镜,
参数说明：
sprite:   修改3dlut滤镜的sprite
filterid: 老的滤镜id
lutId:    新的3dlut滤镜id，例如：'3dlut_WonderWoman', '3dlut_KeepRed'
*/
  function update3dlutFilter(sprite, filterId, lutId) {
    //判断类型是否一致
    if (sprite && sprite.filters) {
      let resources = window.allResources;
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

  //解释转场
  function parseTransition(sprite, texture, transition) {
    if (!texture.baseTexture) {
      texture = renderTexture;
    }
    if (transition && transition.cutId) {
      let _transition = window.transitionLib.getTransition(transition.cutId);
      let uniforms = {};
      if (_transition.options.metadata) {
        if (_transition.options.metadata.uniforms) {
          uniforms = JSON.parse(
            JSON.stringify(_transition.options.metadata.uniforms),
          );
        }
      }
      uniforms.progress = 0.0;
      uniforms.toSampler = texture;

      if (transition.cutParam) {
        for (let prop in transition.cutParam) {
          console.log(prop + ': ' + transition.cutParam[prop]);
          uniforms[prop] = transition.cutParam[prop];
        }
      }

      console.log('transition.cutId:' + transition.cutId);
      if (_transition.data) {
        let filter = new PIXI.Filter(
          window.transitionLib.vertex,
          _transition.data,
          uniforms,
        );
        filter.type = 'transition';
        filter.id = transition.cutId;
        // Add the filter
        if (sprite.filters) {
          sprite.filters.push(filter);
        } else {
          sprite.filters = [filter];
        }
        sprite.transition = transition.cutDuration;
      }
    }
  }

  function removeTransition(sprite, cutId) {
    if (sprite && sprite.filters) {
      sprite.transition = 0;
      for (let i = 0; i < sprite.filters.length; i++) {
        if (
          sprite.filters[i].id === cutId &&
          sprite.filters[i].type === 'transition'
        ) {
          sprite.filters.splice(i, 1);
          break;
        }
      }
    }
  }

  function updateTransition(sprite, oldId, transition) {
    if (sprite && sprite.filters) {
      for (let i = 0; i < sprite.filters.length; i++) {
        if (
          sprite.filters[i].id === oldId &&
          sprite.filters[i].type === 'transition'
        ) {
          let _transition = window.transitionLib.getTransition(
            transition.cutId,
          );
          let uniforms = {};
          if (_transition.options.metadata) {
            if (_transition.options.metadata.uniforms) {
              uniforms = JSON.parse(
                JSON.stringify(_transition.options.metadata.uniforms),
              );
            }
          }
          uniforms.progress = 0.0;
          uniforms.toSampler = sprite.filters[i].uniforms.toSampler;

          if (transition.cutParam) {
            for (let prop in transition.cutParam) {
              console.log(prop + ': ' + transition.cutParam[prop]);
              uniforms[prop] = transition.cutParam[prop];
            }
          }

          console.log('transition.cutId:' + transition.cutId);
          if (_transition.data) {
            //remove old filter
            sprite.filters.splice(i, 1);

            let filter = new PIXI.Filter(
              window.transitionLib.vertex,
              _transition.data,
              uniforms,
            );
            filter.type = 'transition';
            filter.id = transition.cutId;
            // Add the filter
            if (sprite.filters) {
              sprite.filters.push(filter);
            } else {
              sprite.filters = [filter];
            }
            sprite.transition = transition.cutDuration;
          }
          break;
        }
      }
    }
  }

  // 从舞台中删除
  function removeFromStage(app, containerType, id) {
    let trackIndexInStage, itemIndexInStage;
    for (let index = 0; index < app.stage.children.length; index++) {
      const container = app.stage.children[index];
      if (
        convertLowerCase(containerType) === 'image' &&
        convertLowerCase(container.type) === 'static'
      ) {
        // static轨道
        for (let j = 0; j < container.children.length; j++) {
          const itemSprite = container.children[j];
          if (itemSprite.id === id) {
            app.stage.children[index].children.splice(j, 1);
            return false;
          }
        }
      } else {
        if (
          convertLowerCase(container.type) === convertLowerCase(containerType)
        ) {
          for (let j = 0; j < container.children.length; j++) {
            const itemSprite = container.children[j];
            if (itemSprite.id === id) {
              trackIndexInStage = index;
              itemIndexInStage = j;
              break;
            }
          }
        }
      }
    }
    if (trackIndexInStage || trackIndexInStage === 0) {
      if (app.stage.children[trackIndexInStage].children) {
        app.stage.children[trackIndexInStage].children.splice(
          itemIndexInStage,
          1,
        );
      }
    }
  }

  //项目json维护
  //获取json node
  function getJsonNodes(obj, key, val) {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
        objects = objects.concat(getJsonNodes(obj[i], key, val));
      }
      //if key matches and value matches
      else if (i == key && obj[i] == val) {
        objects.push(obj);
      }
    }
    return objects;
  }

  //在parent node 里增加node
  function addJsonNode(parentNode, name, item, isArrayItem) {
    if (isArrayItem) {
      parentNode[name].push(item);
    } else {
      parentNode[name] = item;
    }
    return parentNode;
  }

  // 新增轨道,新增轨道时先创建对应的container
  function addContainer(app, trackId, trackType) {
    let container = new PIXI.Container();
    container.sortableChildren = true;
    container.id = trackId;
    container.type = trackType;
    if (trackType === 'SUBTITLE') {
      container.zIndex = 100000;
    }
    app.stage.addChild(container);
    return container;
  }

  //item 是一个json节点，比如 压条、video、image、text, 返回 pixi 类sprite object
  /*
   * item: json节点, container:轨道, index: 新增节点放置轨道中的位置, resources：资源池
   * */
  function addNode(app, item, container, resources, index, loadedCallBack) {
    if (!app) {
      return false;
    }
    if (
      convertLowerCase(item.type) === 'motion' ||
      convertLowerCase(item.type) === 'subtitle'
    ) {
      let node = {};
      var zIndex = 0;
      let containers = container.children;
      if (index > containers.length || index < 0) return;
      containers.forEach(function (it, id) {
        if (id >= index) {
          if (id == index) {
            zIndex = it.zIndex;
          }
          it.zIndex = it.zIndex + 10;
        }
      });
      node = parseItem(app, item, zIndex);
      container.addChild(node);
      loadedCallBack && loadedCallBack();
    } else {
      addResources(app, resources, () => {
        let mySound = app.soundes;
        if (
          convertLowerCase(item.type) === 'video' ||
          convertLowerCase(item.type) === 'image'
        ) {
          let nodeSprite = {};
          var zIndex = 0;
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
          nodeSprite = parseItem(app, item, zIndex);
          if (
            convertLowerCase(item.type) === 'video' ||
            convertLowerCase(item.type) === 'image'
          ) {
            if (item.originVolume) {
              mySound = parseAddNodeAudio(item, mySound);
            }
            //处理转场 transition
            if (item.transition && item.transition.cutId && nodeSprite) {
              parseTransition(nodeSprite, renderTexture, item.transition);
            }
          }
          if (nodeSprite) {
            container.addChild(nodeSprite);
            // 检测添加完成后，按开始时间倒序
            this.addChildTimer = setInterval(() => {
              if (container.children.length > prevContainersLength) {
                clearInterval(this.addChildTimer);
                container.children.sort((a, b) => {
                  return b.startTime - a.startTime;
                });
              }
            }, 100);
          }
        } else if (convertLowerCase(item.type) === 'audio') {
          mySound = parseAddNodeAudio(item, mySound);
        }
        app.soundes = mySound;
        loadedCallBack && loadedCallBack();
      });
    }
  }

  /**
   * 加载字幕文件
   * app, container, resource, loadedCallBack
   */
  function addSubtitle(app, subtitles = [], container, index, loadedCallBack) {
    if (!app) {
      return false;
    }
    let nodeSprite = {};
    var zIndex = 0;
    let containers = container.children || [];
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

    for (let item of subtitles) {
      nodeSprite = parseItem(app, item, zIndex);
      if (nodeSprite) {
        container.addChild(nodeSprite);
      }
    }

    // 检测添加完成后，按开始时间倒序
    this.addChildTimer = setInterval(() => {
      if (container.children.length > prevContainersLength) {
        clearInterval(this.addChildTimer);
        container.children.sort((a, b) => {
          return b.startTime - a.startTime;
        });
      }
    }, 100);

    loadedCallBack && loadedCallBack();
  }

  function parseAddNodeAudio(item, mySound) {
    let sound;
    if (item.from === 'resource') {
      let id = item.id;
      if (convertLowerCase(item.type) == 'video') {
        id = id + '_a';
      }
      sound = mySound.find(id);
      if (sound) {
        //需要设置options,因为在offline为true时编码aac时用到options参数里面的when,start等值 2021-02-04
        sound.options = {
          when: item.startTime,
          start: item.whenStartTime,
          end: item.whenEndTime,
          speed: item.speed || 1,
          volume: item.volume ? item.volume : 1,
          loop: item.loop ? item.loop : 0,
          duration:
            item.whenEndTime - item.whenStartTime || item.originDuration,
        };
        sound.speed = item.speed || 1;
        sound.isUse = true;
      }
    } else {
      if (!mySound._sounds[item.id]) {
        mySound.loading = mySound.loading + 1;
        sound = mySound.add(item.id || item.name, {
          materialId: item.materialId,
          url: item.src,
          preload: true,
          when: item.startTime,
          start: item.whenStartTime,
          end: item.whenEndTime,
          speed: item.speed || 1,
          volume: item.volume ? item.volume : 1,
          loop: item.loop ? item.loop : 0,
          duration: item.whenEndTime - item.whenStartTime,
          playDuration: item.whenEndTime - item.whenStartTime,
          loaded: function () {
            mySound.loaded = mySound.loaded + 1;
          },
        });
        sound.speed = item.speed || 1;
        sound.isUse = true;
      } else {
        sound = mySound.find(item.id);
        if (sound) {
          sound.options = {
            materialId: item.materialId,
            url: item.src,
            preload: true,
            when: item.startTime,
            start: item.whenStartTime,
            end: item.whenEndTime,
            speed: item.speed || 1,
            volume: item.volume ? item.volume : 1,
            loop: item.loop ? item.loop : 0,
            duration: item.whenEndTime - item.whenStartTime,
            playDuration: item.whenEndTime - item.whenStartTime,
          };
          sound.speed = item.speed || 1;
          sound.isUse = true;
        }
      }
    }

    if (sound) {
      let filters = [];
      var filter;
      const filtersCount = item.audioFilters ? item.audioFilters.length : 0;
      for (let f = 0; f < filtersCount; f++) {
        let name = item.audioFilters[f].name;
        if (name == '') continue;
        filter = new mySound.filters[name]();
        let param = item.audioFilters[f].param;
        for (prop in param) {
          if (typeof param[prop] == 'number' || typeof param[prop] == 'boolean')
            filter[prop] = param[prop];
        }

        filters.push(filter);
      }
      sound.filters = filters;
      return mySound;
    } else {
      return mySound;
    }
  }

  // 更新音频效果
  function updateAudioEffect(app, curActiveEle) {
    let id = curActiveEle.id;
    if (convertLowerCase(curActiveEle.type) === 'video') {
      id = curActiveEle.id + '_a';
    }
    let mySound = app.soundes;
    let curSound = mySound.find(id);
    if (curSound) {
      let filters = [];
      var filter;
      const filtersCount = curActiveEle.audioFilters
        ? curActiveEle.audioFilters.length
        : 0;
      for (let f = 0; f < filtersCount; f++) {
        let name = curActiveEle.audioFilters[f].name;
        if (name === '') continue;
        filter = new mySound.filters[name]();
        let param = curActiveEle.audioFilters[f].param;
        for (let prop in param) {
          if (typeof param[prop] == 'number' || typeof param[prop] == 'boolean')
            filter[prop] = param[prop];
        }
        //myFilter = filter;  //仅用于测试过滤器的值
        filters.push(filter);
      }
      curSound.filters = filters;
    }
  }

  /*
//更新注意：资源没有更改才能更新，否则，删除、新增思路处理
//olditem:原来的json节点, item：更新后的json节点， container：app的轨道, oldindex: 在轨道中的原来的位置序号，index:在轨道中新的位置， resources用到的资源池
 */
  function updateNode(olditem, item, container, oldindex, index) {
    let containers = container.children;
    let node = containers[oldindex];
    let resources = window.allResources;

    //比较一下 texture 来源、资源，不同则更新texture
    if (olditem.id !== item.id || olditem.from !== item.from) {
      console.log('update node must be same!');
      return;
    }

    if (convertLowerCase(item.type) == 'video') {
      if (
        olditem.whenStartTime !== item.whenStartTime ||
        olditem.whenEndTime !== item.whenEndTime
      ) {
        node.whenStartTime = item.whenStartTime;
        node.whenEndTime = item.whenEndTime;
        var url = item.src;
        if (item.from == 'resource') {
          url = resources[item.id].source;
        }
        let controler = node.texture.baseTexture.resource.source;
        controler.src = url;
        controler.load();
      }
    }

    //其他属性变更
    node.width = item.width;
    node.height = item.height;
    node.x = item.left;
    node.y = item.top;
    node.anchor.set(item.anchor || 0);
    node.rotation = item.rotation || 0;
    node.alpha = item.alpha || 1;
    node.visible = item.visible;

    //自定义属性
    node.startTime = item.startTime;
    node.endTime = item.endTime;

    //重排zIndex
    let len = containers.length;
    let row_zIndex = node.zIndex - (node.zIndex % 1000);
    let zIndex = row_zIndex + (len - index) * 10;
    let min = oldindex < index ? oldindex : index;
    let max = oldindex > index ? oldindex : index;
    let added = oldindex < index ? -10 : 10;
    containers.forEach(function (it, id) {
      if (id >= min && id <= max) {
        it.zIndex = row_zIndex + (len - id) * 10 + added;
      }
    });
    node.zIndex = zIndex;
  }

  function parseItem(app, item, zIndex, isDecodeMode = false) {
    let url, texture, sprite, isVerticalSubtitle;
    let resources = window.allResources;
    switch (convertLowerCase(item.type)) {
      case 'video':
        if (item.from === 'url') {
          //resource跟url处理一致，都自己带上#t=start,end信息
          if (!isDecodeMode) {
            texture = PIXI.Texture.from(item.src);
            if (texture) {
              texture.baseTexture.resource.autoLoad = true;
              texture.baseTexture.resource.autoPlay = false;
              let controler = texture.baseTexture.resource.source;
              controler.muted = true;
              if (item.speed) {
                controler.playbackRate = item.speed;
              }
              sprite = new PIXI.Sprite(texture);
            }
          } else {
            let decoder = new window.OGVDecoder(item.src, item.whenStartTime);
            if (item.speed) {
              decoder.speed = item.speed;
            }
            let canvas = decoder.getCanvas();
            texture = PIXI.Texture.from(canvas);
            if (texture) {
              sprite = new PIXI.Sprite(texture);
              sprite.decoder = decoder;
              decoder.onloaded = function () {
                // outFps = decoder.fps > outFps ? decoder.fps : outFps;
              };
            }
          }
        } else {
          let alias = item.id + '_v';
          if (resources[alias] && resources[alias].data) {
            if (!isDecodeMode) {
              // console.log("load video resource");
              let videoResource = new PIXI.VideoResource(
                resources[alias].data,
                {
                  autoPlay: false,
                  autoLoad: true,
                },
              );
              let controler = videoResource.source;
              controler.muted = true;
              if (item.speed) {
                controler.playbackRate = item.speed;
              }
              texture = PIXI.Texture.from(videoResource);
              if (texture) {
                sprite = new PIXI.Sprite(texture);
              }
            } else {
              let decoder = new window.OGVDecoder(
                resources[alias].url,
                item.whenStartTime,
              );
              if (item.speed) {
                decoder.speed = item.speed;
              }
              let canvas = decoder.getCanvas();
              texture = PIXI.Texture.from(canvas);
              if (texture) {
                sprite = new PIXI.Sprite(texture);
                sprite.decoder = decoder;
                decoder.onloaded = function () {
                  // outFps = decoder.fps > outFps ? decoder.fps : outFps;
                };
              }
            }
          } else {
            console.log('Error:No resource');
          }
        }
        if (sprite) {
          sprite.whenStartTime = item.whenStartTime;
          sprite.whenEndTime = item.whenEndTime;
        }
        break;
      case 'image':
        // debugger
        if (item.from === 'url') {
          url = item.src;
          texture = PIXI.Texture.from(url);
        } else {
          if (resources[item.id]) {
            texture = resources[item.id].texture;
          }
        }
        if (texture) {
          sprite = new PIXI.Sprite(texture);
          sprite.materialType = item.materialType;
          if (
            (convertLowerCase(item.materialType) === 'logo' ||
              convertLowerCase(item.materialType) === 'image') &&
            !app.soundLoaded
          ) {
            if (!app.soundLoaded) {
              sprite.interactive = true;
              sprite.buttonMode = true;
            }
            sprite.positionId = item.positionId;
          }
          if (item.breathingLight && item.breathingLight.options) {
            sprite.breathingLight = item.breathingLight;
          }
        }
        break;
      case 'text':
        sprite = new PIXI.Text(item.content, item.style);
        break;
      // case "range":
      // debugger
      //   sprite = new PIXI.Text(item.content, item.style);
      //   break;
      case 'mtext':
      case 'motion':
        item.width = item.originWidth * item.motionSizeScale;
        item.height = item.originHeight * item.motionSizeScale;
        sprite = new PIXI.Container();
        const cover = new PIXI.animate.Graphics();
        cover.lineStyle(0);
        cover.beginFill(0x0, 1);
        cover.drawRect(0, 0, item.width, item.height);
        cover.endFill();
        sprite.addChild(cover);
        sprite.mask = cover;
        sprite.type = item.type;
        // debugger
        var motion_class = window.motionLib.motions[item.name || item.id];
        var motion = new motion_class.stage();
        let keepFrame = motion.totalFrames - 1;
        //keepFrame ==== 0 不支持停留， keepFrame负值：保留倒数指定的帧, keepFrame正值: 保留正序指定的帧
        if (motion_class.keepFrame === 0) {
          keepFrame = 0;
        }
        if (motion_class.keepFrame) {
          keepFrame = motion_class.keepFrame;
          if (keepFrame < 0) {
            keepFrame = motion.totalFrames + keepFrame;
          }
          if (keepFrame < 0 || keepFrame > motion.totalFrames) {
            keepFrame = motion.totalFrames - 1;
          }
        }
        motion.keepFrame = keepFrame;
        if (!app.soundLoaded) {
          sprite.interactive = true;
          sprite.buttonMode = true;
        }
        motion.title = item.name;
        motion.id = item.id;
        motion.motionSizeScale = item.motionSizeScale;
        motion.type = item.type;
        motion.originWidth = item.width; // 原始宽高是相对于1280*840比例
        motion.originHeight = item.height;
        motion.x = 0;
        motion.y = 0;
        let defaultTextArr = motion.getTextParams();
        motion.defaultTextArr = defaultTextArr || {};
        if (
          (item.textArray && item.textArray.length > 0) ||
          item.motionSizeScale > 1
        ) {
          // 获取压条文字内容
          if (!item.textArray || item.textArray.length === 0) {
            item.textArray = motion.getTextParams();
          }
          item.textArray.forEach((subItem, subIndex) => {
            // 根据原始字体大小和缩放比例，更新文字内容以及mask宽高
            if (
              subItem &&
              subItem.text &&
              subItem.text.style &&
              subItem.text.style.fontSize
            ) {
              let originFontSize = 20;
              if (
                defaultTextArr &&
                defaultTextArr[subIndex] &&
                defaultTextArr[subIndex].text &&
                defaultTextArr[subIndex].text.style.fontSize
              ) {
                originFontSize = defaultTextArr[subIndex].text.style.fontSize;
              }
              subItem.text.style.fontSize =
                originFontSize * item.motionSizeScale;
            }
          });
          // debugger
          let maskWHObj = window.motionLib.updateMotion(
            motion,
            item.textArray || [],
          );
          sprite.mask.width = maskWHObj.finalWidth;
          sprite.mask.height = maskWHObj.finalHeight;
          if (item.textColors) {
            item.textColors.forEach((textColor) => {
              window.motionLib.updateMotionColor(motion, textColor);
            });
          }
          if (item.bgColors) {
            item.bgColors.forEach((bgColor) => {
              window.motionLib.updateMotionColor(motion, bgColor);
            });
          }

          // 设置当前帧位置为0
          motion.gotoAndStop(0);
        }
        sprite.addChild(motion);
        motion.gotoAndStop(motion.totalFrames);
        break;
      case 'subtitle':
        const subtitleMargin = 20; //layout位置离边界的距离
        const subtitlePad = 100; //文字两边留空的总和 （左右或者上下留白的长度)
        let pad = subtitlePad;
        let margin = subtitleMargin;
        if (item.pad) {
          pad = item.pad;
        }
        if (item.margin) {
          margin = item.margin;
        }
        var width, height;
        var isV;
        if (item.style['writing-mode'] === 'horizontal-tb') {
          isV = false;
          width = app.width - pad;
          item.style['max-width'] = width + 'px';
          height = parseInt(parseInt(item.style['font-size']) * 1.2);
        } else {
          isV = true;
          height = app.height - pad;
          item.style['max-height'] = height + 'px';
          width = parseInt(parseInt(item.style['font-size']) * 1.2);
        }

        let subtitleTextAlign = 'center';
        if (item.style['text-align']) {
          subtitleTextAlign = item.style['text-align'];
        }
        let stypeStr =
          'white-space: pre-line;writing-mode:' + item['writing-mode'] + ';';
        let wholeStr = stypeStr;
        let fontStr;
        for (x in item.style) {
          wholeStr = wholeStr + x + ':' + item.style[x] + ';';
          if (
            x !== 'background' &&
            x !== 'padding' &&
            x !== 'text-align' &&
            x !== 'writing-mode'
          ) {
            stypeStr = stypeStr + x + ':' + item.style[x] + ';';
          }
        }
        let size = getSubtitleSize('div', wholeStr, item.name);
        const width_pad = 10,
          height_pad = 10;
        let src = `<svg xmlns="http://www.w3.org/2000/svg" width="${
          size.width + width_pad
        }" height="${size.height + height_pad}">${
          item.frame
            ? window.subtitleBubblesLib.getBubbleBgStr(
                item.frame,
                { width: size.width, height: size.height },
                isV,
              )
            : ''
        }<foreignObject x="0" y="0" width="100%" height="100%">`;
        let style =
          `<div xmlns="http://www.w3.org/1999/xhtml" style="padding:${item.style['padding']};writing-mode:${item.style['writing-mode']}">` +
          `<div style="background:${
            item.style['background'] ? item.style['background'] : ''
          };text-align:${
            item.style['text-align'] ? item.style['text-align'] : ''
          };writing-mode:${
            item.style['writing-mode'] ? item.style['writing-mode'] : ''
          };">` +
          `<tspan style="${stypeStr}">` +
          item.name +
          '</tspan></div></div></foreignObject></svg>';
        src = src + style;
        if (item.style['writing-mode'] === 'horizontal-tb') {
          let subTitletexture = PIXI.Texture.from(src);
          sprite = new PIXI.Sprite(subTitletexture);
          setSubTitleParams(sprite);
        } else {
          isVerticalSubtitle = true;
          let dom = document.createElement('div');
          dom.innerHTML = src;
          dom.setAttribute('style', 'position: absolute; right: 10000px');
          document.body.appendChild(dom);
          // eslint-disable-next-line no-undef
          return new Promise((resolve) => {
            window
              .html2canvas(dom, {
                backgroundColor: null,
                width: size.width + width_pad,
                height: size.height + height_pad,
                scale: 1,
              })
              .then((canvas) => {
                let baseImg = canvas.toDataURL();
                let subTitletexture = PIXI.Texture.from(baseImg);
                sprite = new PIXI.Sprite(subTitletexture);
                document.body.removeChild(dom);
                setSubTitleParams(sprite);
                return commonSprite(sprite, resolve);
              });
          });
        }

        function setSubTitleParams(sprite) {
          //为了字幕的显示效果，默认设置相关属性
          if (sprite) {
            sprite.visible = false;
            sprite.rotation = 0;
            sprite.alpha = 1;
            sprite.zIndex = 100000;
            //自定义属性
            sprite.isSubtitle = true; //自定义属性
            sprite.type = item.type; //自定义属性
            if (!app.soundLoaded) {
              sprite.interactive = true;
              sprite.buttonMode = true;
            }
            sprite.title = item.name;
            sprite.type = item.type;
            sprite.subtitleIndex = -1; //自定义属性，动态显示需要
            sprite.subtitlePad = pad;
            sprite.subtitleWidth = width;
            sprite.subtitleHeight = height;
            sprite.subtitleMargin = margin;
            sprite.subtitleTextAlign = subtitleTextAlign;
            sprite.frame = item.frame;
            sprite.wordart = item.wordart;
            sprite.materialId = item.materialId;
            sprite.subtitleLayout = 'bottom';
            if (item.layout) {
              sprite.subtitleLayout = item.layout;
            }
            sprite.subtitleMode = item.style['writing-mode'];
            sprite.subtitleStyle = stypeStr;
            sprite.id = item.id; //id 唯一，可以用于建立sprite 跟json对象的对应关系
            sprite.startTime = item.startTime;
            sprite.endTime = item.endTime;
            if (sprite.subtitleMode === 'horizontal-tb') {
              if (item.left || item.left !== 0) {
                sprite.x = item.left;
              } else {
                sprite.x = (app.width - size.width) / 2;
              }

              if (item.top || item.top !== 0) {
                sprite.y = item.top;
              } else {
                sprite.y = app.height - size.height - sprite.subtitleMargin;
              }
            } else {
              if (item.left || item.left !== 0) {
                sprite.x = item.left;
              } else {
                sprite.x = app.width - size.width - sprite.subtitleMargin;
              }

              if (item.top || item.top !== 0) {
                sprite.y = item.top;
              } else {
                sprite.y = app.height - (size.height + sprite.subtitlePad / 2);
              }
            }
          }
        }

        break;
      default:
        console.log('unsupport');
    }
    // 当为字幕且为纵向时为异步，需等待，其他则执行返回
    if (!isVerticalSubtitle) {
      return commonSprite(sprite);
    }
    function commonSprite(sprite, resolve) {
      if (sprite) {
        if (convertLowerCase(item.type) !== 'subtitle') {
          if (
            convertLowerCase(item.materialType) === 'logo' ||
            convertLowerCase(item.materialType) === 'image'
          ) {
            if (item && item.anchor && item.anchor.isAnchor) {
              sprite.anchor.set(item.anchor.option.x, item.anchor.option.y);
            }
          } else {
            if (sprite.anchor) {
              sprite.anchor.set(item.anchor || 0);
            }
          }
          if (convertLowerCase(item.type) !== 'text') {
            sprite.width = item.width;
            sprite.height = item.height;
          }
          sprite.x = item.left;
          sprite.y = item.top;
          sprite.type = item.type;
          sprite.title = item.name;
          sprite.rotation = item.rotation || 0;
          sprite.alpha = item.alpha || 1;
          sprite.zIndex = zIndex;
          sprite.visible = false;

          //自定义属性
          sprite.id = item.id; //id 唯一，可以用于建立sprite 跟json对象的对应关系
          sprite.startTime = item.startTime;
          if (convertLowerCase(sprite.type) == 'video') {
            /*
            sprite.endTime =
              item.startTime + (item.whenEndTime - item.whenStartTime);
            */
            sprite.endTime = item.endTime;
          } else {
            sprite.endTime = item.endTime;
          }

          sprite.speed = item.speed;
          //处理滤镜 filters
          if (item.videoFilters) {
            parseVideoFilters(sprite, item.videoFilters);
          }
          // 处理呼吸灯效果
          if (item.breathingLight && item.breathingLight.options) {
            parseBreathingLight(app, sprite, item);
          }
        }

        if (callBacks['parseItem']) {
          callBacks['parseItem'](item, sprite);
        }
      }
      if (resolve) {
        resolve(sprite);
      } else {
        return sprite;
      }
    }
  }

  //return PIXI.Container
  function parseVideo(app, v, row_zIndex, isDecodeMode = false) {
    let container = new PIXI.Container();
    container.sortableChildren = true;
    let child = v.child;
    const childCount = child.length;
    for (let i = childCount - 1; i > -1; i--) {
      let item = child[i];
      let zIndex = row_zIndex + (childCount - i) * 10;
      let sprite = parseItem(app, item, zIndex, isDecodeMode);
      //处理转场 transition
      if (item.transition && sprite) {
        if (i < child.length - 1 && item.transition.cutId) {
          parseTransition(sprite, renderTexture, item.transition);
        }
      }
      if (sprite) {
        //保存纹理，转场备用
        container.addChild(sprite);
      } else {
        console.log("'" + item.name + "' no texture");
      }
    }
    return container;
  }

  //return PIXI.Container
  function parseMotion(app, m, row_zIndex) {
    let container = new PIXI.Container();
    container.sortableChildren = true;
    let child = m.child;
    const childCount = child.length;
    for (let i = childCount - 1; i > -1; i--) {
      let item = child[i];
      let zIndex = row_zIndex + (childCount - i) * 10;
      let sprite = parseItem(app, item, zIndex);
      if (sprite) {
        container.addChild(sprite);
      } else {
        console.log("'" + item.name + "' no texture");
      }
    }
    return container;
  }

  function parseImage(app, s, row_zIndex) {
    var container = new PIXI.Container();
    container.sortableChildren = true;
    let child = s.child;
    const childCount = child.length;
    for (let i = childCount - 1; i > -1; i--) {
      let item = child[i];
      let zIndex = row_zIndex + (childCount - i) * 10;
      let sprite = parseItem(app, item, zIndex);
      //处理转场 transition
      if (item.transition && sprite) {
        if (i < child.length - 1 && item.transition.cutId) {
          parseTransition(sprite, renderTexture, item.transition);
        }
      }
      if (sprite) {
        container.addChild(sprite);
      } else {
        console.log("'" + item.name + "' no texture");
      }
    }
    return container;
  }

  //return PIXI.Container
  function parseStatic(app, s, row_zIndex) {
    var container = new PIXI.Container();
    container.sortableChildren = true;
    let child = s.child;
    const childCount = child.length;
    for (let i = childCount - 1; i > -1; i--) {
      let item = child[i];
      let zIndex = row_zIndex + (childCount - i) * 10;
      let sprite = parseItem(app, item, zIndex);
      if (sprite) {
        container.addChild(sprite);
      } else {
        console.log("'" + item.name + "' no texture");
      }
    }
    return container;
  }

  function parseBreathingLight(app, sprite, item) {
    sprite.anchor.set(0.5);
    sprite.x = app.renderer.width / 2;
    sprite.y = app.renderer.height / 2;
  }

  //更新字幕内容
  function updateSubtitle(item, millis, videoWidth, videoHeight, resolve) {
    let stypeStr, bgStr, paddingStr, alignStr, modeStr, wordStr;

    const styleArray = item.subtitleStyle.split(';');
    bgStr =
      styleArray.filter((item) => item.indexOf('background:') !== -1)[0] + ';';
    stypeStr = styleArray
      .filter((item) => item.indexOf('background:') === -1)
      .filter((item) => item.indexOf('padding') === -1)
      .filter((item) => item.indexOf('text-align:') === -1)
      .filter((item) => item.indexOf('writing-mode:') === -1)
      .filter((item) => item.indexOf('word-break:') === -1)
      .join(';');
    paddingStr =
      styleArray.filter((item) => item.indexOf('padding') !== -1)[0] + ';';
    alignStr =
      styleArray.filter((item) => item.indexOf('text-align:') !== -1)[0] + ';';
    modeStr =
      styleArray.filter((item) => item.indexOf('writing-mode:') !== -1)[0] +
      ';';
    wordStr =
      styleArray.filter((item) => item.indexOf('word-break:') !== -1)[0] + ';';

    // let stypeStr = item.subtitleStyle
    let size = getSubtitleSize('div', item.subtitleStyle, item.title);
    const width_pad = 10,
      height_pad = 10;
    let isV = item.subtitleMode === 'horizontal-tb' ? false : true;
    let src = `<svg xmlns="http://www.w3.org/2000/svg" width="${
      size.width + width_pad
    }" height="${size.height + height_pad}">${
      item.frame
        ? window.subtitleBubblesLib.getBubbleBgStr(
            item.frame,
            { width: size.width, height: size.height },
            isV,
          )
        : ''
    }<foreignObject x="0" y="0" width="100%" height="100%">`;
    let style =
      `<div xmlns="http://www.w3.org/1999/xhtml" style=" ${paddingStr}${
        modeStr ? modeStr : ''
      }">` +
      `<div style="${bgStr ? bgStr : ''}${alignStr ? alignStr : ''}">` +
      `<tspan style="${stypeStr}">` +
      item.title +
      '</tspan></div></div></foreignObject></svg>';
    src = src + style;
    if (item.subtitleMode === 'horizontal-tb') {
      let texture = PIXI.Texture.from(src);
      item.texture = texture;
      resolve && resolve();
    } else {
      let dom = document.createElement('div');
      dom.innerHTML = src;
      dom.setAttribute('style', 'position: absolute; right: 10000px');
      document.body.appendChild(dom);
      // eslint-disable-next-line no-undef
      window
        .html2canvas(dom, {
          backgroundColor: null,
          width: size.width + width_pad,
          height: size.height + height_pad,
          scale: 1,
        })
        .then((canvas) => {
          let baseImg = canvas.toDataURL();
          let texture = PIXI.Texture.from(baseImg);
          item.texture = texture;
          document.body.removeChild(dom);
          resolve && resolve();
        });
    }
  }

  // 获取字幕宽高
  function getSubtitleSize(element = 'div', style = '', html = '') {
    let node = document.createElement(element); //创建一个新容器
    style.split(';').forEach(function (item, index) {
      if (item.length > 0) {
        var items = item.split(':');
        node.style.setProperty(items[0], items[1]);
      }
    });
    node.style.setProperty('display', 'inline-block');
    node.style.setProperty('visibility', 'hidden');
    node.innerHTML = html;
    document.body.appendChild(node); //需要将新容器挂载到DOM中,浏览器才会进行高度计算
    let height = window.getComputedStyle(node).height;
    let width = window.getComputedStyle(node).width;
    // console.log("getSubtitleSize, html:" + html+", width:" + width + ", height:" + height + ",clientHeight:" + node.clientHeight);
    document.body.removeChild(node); //需要将镜像DOM进行移除

    if (height.indexOf('px') > 0) {
      height = parseInt(height.split('px')[0]);
    } else {
      height = 0;
    }
    if (width.indexOf('px') > 0) {
      width = parseInt(width.split('px')[0]);
    } else {
      width = 0;
    }
    return { width: width, height: height };
  }

  //app 删除字幕
  function removeSubtitle(app, callback) {
    if (!app) {
      return false;
    }

    //删除现有的字幕
    app.stage.children.forEach(function (container, id) {
      if (container.isSubtitle) {
        app.stage.removeChild(container);
      }
    });

    callback && callback();
  }

  // 解析srt
  function parseSrt(app, itemMode, resouces, callback) {
    if (!app) {
      return false;
    }

    addResources(app, resouces, () => {
      let subtitles = [];
      let resource = window.allResources;
      let content = resource[resouces[0].alias].data;
      let srt = new window.Srt(content);
      let lines = srt.lines || [];
      // 循环组装字幕列表
      for (let item of lines) {
        // 这部分应放在业务代码里
        let tempItem = JSON.parse(JSON.stringify(itemMode));
        tempItem.id = `${new Date().getTime()}_${item.counter}`;
        tempItem.name = item.subtitle;
        tempItem.startTime = item.start.when / 1000;
        tempItem.endTime = item.end.when / 1000;
        tempItem.whenStartTime = 0;
        tempItem.whenEndTime = item.end.when / 1000 - item.start.when / 1000;
        tempItem.duration = item.end.when / 1000 - item.start.when / 1000;
        subtitles.push(tempItem);
      }
      callback && callback(subtitles);
    });
  }

  //处理字幕
  function parseSubtitle(app, s, row_zIndex, parseProResolve, callback) {
    let container = new PIXI.Container();
    container.sortableChildren = true;
    container.isSubtitle = true;
    let child = s.child;
    const childCount = child.length;
    // 当是纵向字幕时，html2canvas 为异步获取
    async function asyncParse() {
      for (let i = childCount - 1; i > -1; i--) {
        let item = child[i];
        let zIndex = row_zIndex + (childCount - i) * 10;
        let sprite = await parseItem(app, item, zIndex);
        if (sprite) {
          container.addChild(sprite);
        } else {
          console.log("'" + item.name + "' no texture");
        }
      }
      callback && callback(container);
    }
    asyncParse();
  }

  function parseProject(app, prj) {
    const tracks = prj.tracks;
    const trackCount = tracks.length;
    var soundes = app.soundes;
    let promiseAry = [];
    //设置所有的音频资源为不播放
    soundes.resetAllIsUse();
    // 按 track index降序，zIndex 升序 push
    for (var id = trackCount - 1; id > -1; id--) {
      let track = tracks[id];
      var row_zIndex = (trackCount - id) * 1000;
      var container;
      switch (convertLowerCase(track.type)) {
        case 'video':
          container = parseVideo(app, track, row_zIndex, app.record);
          if (container) {
            container.type = track.type;
            container.id = track.id;
            app.stage.addChild(container);
          }
          if (!app.soundLoaded) {
            soundes = parseAudio(soundes, app.duration, track);
          }
          break;
        case 'audio':
          soundes = parseAudio(soundes, app.duration, track);
          break;
        case 'motion':
          container = parseMotion(app, track, row_zIndex);
          if (container) {
            container.id = track.id;
            container.type = track.type;
            app.stage.addChild(container);
          }
          break;
        case 'static':
          container = parseStatic(app, track, row_zIndex);
          if (container) {
            container.id = track.id;
            container.type = track.type;
            app.stage.addChild(container);
          }
          break;
        case 'image':
          container = parseImage(app, track, row_zIndex);
          if (container) {
            container.id = track.id;
            container.type = track.type;
            app.stage.addChild(container);
          }
          break;
        case 'subtitle':
          promiseAry.push(
            // eslint-disable-next-line no-loop-func
            new Promise((parseProResolve) => {
              parseSubtitle(
                app,
                track,
                row_zIndex,
                parseProResolve,
                (container) => {
                  if (container) {
                    container.id = track.id;
                    container.type = track.type;
                    container.visible = !prj.isHideSubTitle;
                    app.stage.addChild(container);
                    parseProResolve();
                  }
                },
              );
            }),
          );
          break;
        default:
          console.log('unsupport');
      }
    }
    // 字幕里有异步操作
    Promise.allSettled(promiseAry).then((result) => {
      app.soundes = soundes;
      if (app.soundLoaded) {
        if (callBacks['exportParsed']) {
          callBacks['exportParsed']();
        }
      } else {
        if (callBacks['parsed']) {
          callBacks['parsed']();
        }
      }
    });
  }

  function renderSpriteWithTransition(sprite, next, millis, seeking = false) {
    let isTransition = false; //是否正在转场
    const filter = sprite.filters[sprite.filters.length - 1]; // transition filter
    if (filter) {
      filter.uniforms.progress = 0;
    }

    if (sprite.startTime * 1000 <= millis && sprite.endTime * 1000 >= millis) {
      if (
        sprite.transition &&
        millis > (sprite.endTime - sprite.transition) * 1000
      ) {
        let dived =
          (sprite.endTime * 1000.0 - millis) / (sprite.transition * 1000.0);
        let progress = 1.0 - dived;
        //console.log("sprite.zIndex:" + sprite.zIndex + ", millis:" + millis + ", sprite.startTime:" + sprite.startTime + ", sprite.endTime" + sprite.endTime + ", progress:" + progress + ", dived:" + dived);
        if (filter) {
          filter.uniforms.progress = progress;
        }
        isTransition = true;
      }
    }
    if (isTransition) {
      if (next.texture.baseTexture.resource instanceof PIXI.VideoResource) {
        if (!next.playing) {
          let controler = next.texture.baseTexture.resource.source;
          let currentTime =
            next.whenStartTime + (millis / 1000.0 - next.startTime);
          //console.log("millis:" + millis + ", next zIndex:" + next.zIndex + ", controler.current_time:" + controler.currentTime + ", currentTime:" + currentTime + ", controler playing");
          controler.currentTime = currentTime;
          if (seeking) {
            next.playing = false;
            next.texture.baseTexture.resource.update();
            //console.log("seeking,  millis:" + millis + ", sprite zIndex:" + sprite.zIndex + ", controler.current_time:" + controler.currentTime + ", currentTime:" + currentTime + ", controler paused");
          } else {
            controler.play();
            next.playing = true;
          }
        } else {
          if (seeking) {
            let controler = next.texture.baseTexture.resource.source;
            let currentTime =
              next.whenStartTime + (millis / 1000.0 - next.startTime);
            if (!controler.paused) {
              controler.pause();
            }
            controler.currentTime = currentTime;
            next.texture.baseTexture.resource.update();
            next.playing = false;
            //console.log("seeking, millis:" + millis + ", next zIndex:" + next.zIndex + ", controler.current_time:" + controler.currentTime + ", currentTime:" + currentTime + ", controler paused");
          }
        }
      }

      if (next.decoder) {
        //console.log("next.decoder millis:"+ millis/1000+ ", next.start:" + next.startTime + ", sub:" + (millis/1000 - next.startTime));
        if (
          !next.decoder.renderFrame(millis / 1000 - next.startTime, seeking)
        ) {
          //console.log("next.decoder renderFrame false");
          return false;
        }
        next.texture.baseTexture.update();
        if (
          renderTexture.width !== next.width ||
          renderTexture.height !== next.height
        ) {
          renderTexture.width = next.width;
          renderTexture.height = next.height;
        }
        transitionRenderer.render(next, renderTexture);
      }
    }

    if (!renderSprite(sprite, millis, seeking)) {
      return false;
    }

    return true;
  }

  function renderSprite(sprite, millis, seeking = false) {
    // console.log("seeking:" + seeking + ", sprite.id:" + sprite.id + ", sprite.startTime:" + sprite.startTime * 1000 + ", sprite.endTime:" + sprite.endTime * 1000 + ", millis:" + millis);
    if (sprite.startTime * 1000 <= millis && sprite.endTime * 1000 >= millis) {
      //console.log("seeking:" + seeking + ", show sprite.id:" + sprite.id + ", sprite.zIndex:" + sprite.zIndex + ", sprite.startTime:" + sprite.startTime * 1000 + ", sprite.endTime:" + sprite.endTime * 1000 + ", millis:" + millis + ", sprite.playing:" + sprite.playing + ", sprite.visible:" + sprite.visible);
      //根据filter名称处理需要动态更新的参数
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
        if (sprite.decoder) {
          sprite.decoder.start();
          sprite.visible = true;
        } else if (
          sprite.texture.baseTexture.resource instanceof PIXI.VideoResource
        ) {
          if (!sprite.playing) {
            let controler = sprite.texture.baseTexture.resource.source;
            let oldCurrentTime = controler.currentTime / controler.playbackRate;
            let currentTime =
              sprite.whenStartTime / controler.playbackRate +
              (millis / 1000.0 - sprite.startTime);
            // console.log("renderSprite0: controler.currentTime: " + controler.currentTime + ", millis: " + millis);
            if (Math.abs(currentTime - oldCurrentTime) >= 0.1) {
              controler.currentTime =
                (currentTime + 0.1) * controler.playbackRate;
              //防止看到以前的缓存帧
              controler.addEventListener(
                'seeked',
                (event) => {
                  sprite.visible = true;
                },
                { once: true },
              );
            } else {
              sprite.visible = true;
            }

            if (seeking) {
              sprite.playing = false;
              sprite.texture.baseTexture.resource.update();
              console.log(
                'seeking,  millis:' +
                  millis +
                  ', sprite zIndex:' +
                  sprite.zIndex +
                  ', controler.current_time:' +
                  controler.currentTime +
                  ', currentTime:' +
                  currentTime +
                  ', controler paused',
              );
            } else {
              console.log('执行play', sprite.title, sprite.id);
              controler.play();
              sprite.playing = true;
            }
          } else {
            sprite.visible = true;
          }
          console.log(
            'playing:' +
              sprite.playing +
              ', seeking:' +
              seeking +
              ', show sprite.id:' +
              sprite.id +
              ', sprite.startTime:' +
              sprite.startTime * 1000 +
              ', sprite.endTime:' +
              sprite.endTime * 1000 +
              ', millis:' +
              millis +
              ', sprite.playing:' +
              sprite.playing +
              ', sprite.visible:' +
              sprite.visible,
          );
        } else {
          sprite.visible = true;
        }
      } else {
        if (sprite.texture.baseTexture.resource instanceof PIXI.VideoResource) {
          let controler = sprite.texture.baseTexture.resource.source;
          //如果播放位置跟预期差值大于100ms,则校准controler当前时间
          let oldCurrentTime = controler.currentTime / controler.playbackRate;
          let currentTime =
            sprite.whenStartTime / controler.playbackRate +
            (millis / 1000.0 - sprite.startTime);
          // console.log("renderSprite1: controler.currentTime: " + controler.currentTime + ", millis: " + millis,'currentTime:',currentTime);
          if (seeking || Math.abs(currentTime - oldCurrentTime) >= 0.1) {
            // console.log("for seeking, millis:" + millis + ", sprite zIndex:" + sprite.zIndex + ", sprite.whenStartTime:" + sprite.whenStartTime + ", sprite.startTime:" + sprite.startTime + ", controler.currentTime:" + controler.currentTime + ", currentTime:" + currentTime + ", controler paused:" + controler.paused+", controler seeking:"+ controler.seeking);
            if (controler.paused) {
              controler.currentTime =
                (currentTime + 0.1) * controler.playbackRate;
              // console.log("paused seeking controler.currentTime:" + controler.currentTime + ", need time:" + (currentTime + 0.1));
              controler.addEventListener('seeked', (event) => {
                sprite.texture.baseTexture.resource.update();
              });
              if (!seeking) {
                console.log('执行play2', sprite.title, sprite.id);
                controler.play();
                sprite.playing = true;
              }
            } else if (!controler.seeking) {
              console.log('try pause...');
              controler.pause();
              sprite.playing = false;
              controler.addEventListener(
                'pause',
                (event) => {
                  controler.currentTime =
                    (currentTime + 0.1) * controler.playbackRate;
                  sprite.texture.baseTexture.resource.update();
                },
                { once: true },
              );
            } else {
              // console.log("seeking controler.currentTime:" + controler.currentTime + ", need time:" + (currentTime + 0.1));
              controler.currentTime =
                (currentTime + 0.1) * controler.playbackRate;
            }
          }
          //console.log("play, millis:" + millis + ", show sprite.id:" + sprite.id + ", sprite zIndex:" + sprite.zIndex + ", controler.current_time:" + controler.currentTime + ", currentTime:" + currentTime + ", controler played");
        }
      }

      if (sprite.decoder) {
        if (
          !sprite.decoder.renderFrame(millis / 1000 - sprite.startTime, seeking)
        ) {
          return false;
        }
        sprite.texture.baseTexture.update();
      }
    } else {
      // console.log("seeking:" + seeking + ", hide sprite.id:" + sprite.id + ", sprite.startTime:" + sprite.startTime * 1000 + ", sprite.endTime:" + sprite.endTime * 1000 + ", millis:" + millis);
      if (sprite.visible) {
        sprite.visible = false;
        if (sprite.texture.baseTexture.resource instanceof PIXI.VideoResource) {
          if (sprite.playing) {
            let controler = sprite.texture.baseTexture.resource.source;
            if (!controler.paused) {
              controler.pause();
            }

            controler.addEventListener(
              'pause',
              (event) => {
                controler.currentTime = sprite.whenStartTime;
                controler.addEventListener('seeked', (event) => {
                  sprite.texture.baseTexture.resource.update();
                });
              },
              { once: true },
            );
            sprite.playing = false;
          }
        }
      } else {
        if (sprite.texture.baseTexture.resource instanceof PIXI.VideoResource) {
          let controler = sprite.texture.baseTexture.resource.source;
          if (controler.currentTime !== sprite.whenStartTime) {
            if (!controler.paused) {
              controler.pause();
              controler.addEventListener(
                'pause',
                (event) => {
                  controler.currentTime = sprite.whenStartTime;
                  controler.addEventListener('seeked', (event) => {
                    sprite.texture.baseTexture.resource.update();
                  });
                },
                { once: true },
              );
            } else {
              controler.currentTime = sprite.whenStartTime;
              controler.addEventListener('seeked', (event) => {
                sprite.texture.baseTexture.resource.update();
              });
            }
          }
        }
      }
    }

    return true;
  }

  function renderMotion(sprite, millis, seeking = false) {
    if (sprite.startTime * 1000 <= millis && sprite.endTime * 1000 >= millis) {
      // console.log("renderMotion seeking:" + seeking + ", show sprite.id:" + sprite.id + ", sprite.startTime:" + sprite.startTime * 1000 + ", sprite.endTime:" + sprite.endTime * 1000 + ", millis:" + millis + ", sprite.playing:" + sprite.playing + ", sprite.visible:" + sprite.visible);
      //根据filter名称处理需要动态更新的参数
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

      //计算现在是哪一帧
      let motion = sprite.children[1];
      let currentFrame = Math.floor(
        (millis / 1000.0 - sprite.startTime) * motion.framerate,
      );

      // motion.keepFrame === 0 : 不希望保留帧，要完全按motion设置直接播放完动画
      if (motion.keepFrame === 0) {
        if (currentFrame < motion.totalFrames) {
          motion.gotoAndStop(currentFrame);
        }
      } else {
        let keepFrame = motion.keepFrame;
        let timeFrames = Math.floor(
          (sprite.endTime - sprite.startTime) * motion.framerate,
        );
        let keepFrames = timeFrames - motion.totalFrames;
        if (keepFrames > 0) {
          if (currentFrame > keepFrame + keepFrames) {
            currentFrame = currentFrame - keepFrames;
          } else if (currentFrame > keepFrame) {
            currentFrame = keepFrame;
          }
        }
        if (currentFrame < motion.totalFrames) {
          motion.gotoAndStop(currentFrame);
          //console.log("motion, motion.totalFrames:" + motion.totalFrames + ", motion.keepFrame:" + motion.keepFrame + ", currentFrame:" + currentFrame + ", millis:" + millis + ', sprite.startTime:' + sprite.startTime + ", sprite.endTime" + sprite.endTime);
        }
      }
    } else {
      if (sprite.visible) {
        sprite.visible = false;
      }
    }
  }

  function renderImage(sprite, millis, seeking = false) {
    if (sprite.startTime * 1000 <= millis && sprite.endTime * 1000 >= millis) {
      // console.log("renderImage seeking:" + seeking + ", show sprite.id:" + sprite.id + ", sprite.startTime:" + sprite.startTime * 1000 + ", sprite.endTime:" + sprite.endTime * 1000 + ", millis:" + millis + ", sprite.playing:" + sprite.playing + ", sprite.visible:" + sprite.visible);
      //根据filter名称处理需要动态更新的参数
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
      } else {
        let curTime = millis - sprite.startTime * 1000;
        let duration = sprite.endTime - sprite.startTime;
        if (sprite.breathingLight && sprite.breathingLight.options) {
          let { scaleOffset, baselineWidth, baselineHeight, scaleType } =
            sprite.breathingLight.options;
          if (scaleType === 'narrow') {
            sprite.width =
              baselineWidth - (scaleOffset / duration / 1000) * curTime;
            sprite.height =
              baselineHeight - (scaleOffset / duration / 1000) * curTime;
          } else {
            sprite.width =
              (scaleOffset / duration / 1000) * curTime + baselineWidth;
            sprite.height =
              (scaleOffset / duration / 1000) * curTime + baselineHeight;
          }
        }
        if (sprite.decoder) {
          if (
            !sprite.decoder.renderFrame(
              millis / 1000 - sprite.startTime,
              seeking,
            )
          ) {
            return false;
          }
          sprite.texture.baseTexture.update();
        }
      }
    } else {
      if (sprite.visible) {
        sprite.visible = false;
      }
    }
    return true;
  }

  function renderImageSpriteWithTransition(
    sprite,
    next,
    millis,
    seeking = false,
  ) {
    let isTransition = false; //是否正在转场
    const filter = sprite.filters[sprite.filters.length - 1]; // transition filter
    if (filter) {
      filter.uniforms.progress = 0;
    }
    if (sprite.startTime * 1000 <= millis && sprite.endTime * 1000 >= millis) {
      if (
        sprite.transition &&
        millis > (sprite.endTime - sprite.transition) * 1000
      ) {
        let dived =
          (sprite.endTime * 1000.0 - millis) / (sprite.transition * 1000.0);
        let progress = (1.0 - dived).toFixed(4);
        //console.log("sprite.zIndex:" + sprite.zIndex + ", millis:" + millis + ", sprite.startTime:" + sprite.startTime + ", sprite.endTime" + sprite.endTime + ", progress:" + progress + ", dived:" + dived);
        if (filter) {
          filter.uniforms.progress = progress;
        }
        isTransition = true;
      }
    }
    if (isTransition) {
      if (next.texture.baseTexture.resource instanceof PIXI.ImageResource) {
        if (!next.playing) {
          let curTime = millis - sprite.startTime * 1000;
          let duration = sprite.endTime - sprite.startTime;
          if (sprite.breathingLight && sprite.breathingLight.options) {
            let { scaleOffset, baselineWidth, baselineHeight, scaleType } =
              sprite.breathingLight.options;
            if (scaleType === 'narrow') {
              sprite.width =
                baselineWidth - (scaleOffset / duration / 1000) * curTime;
              sprite.height =
                baselineHeight - (scaleOffset / duration / 1000) * curTime;
            } else {
              sprite.width =
                (scaleOffset / duration / 1000) * curTime + baselineWidth;
              sprite.height =
                (scaleOffset / duration / 1000) * curTime + baselineHeight;
            }
          }
          if (seeking) {
            next.playing = false;
          } else {
            next.playing = true;
          }
        } else {
          if (seeking) {
            next.playing = false;
          }
        }
      }
    }

    if (!renderImage(sprite, millis, seeking)) {
      return false;
    }

    return true;
  }

  //判断库里资源是否存在
  /*
   例子：
   parseLib.isResourceExist(["video1","video2"]);
   parseLib.isResourceExist("video1");
*/
  function isResourceExist(name) {
    // const loader = PIXI.Loader.shared;
    // console.log(window.allResources[name]);
    if (window.allResources[name]) {
      return true;
    }
    return false;
  }

  // 判断音频资源是否已存在
  function isAudioResourceExist(app, name) {
    let sounds = app.soundes._sounds;
    if (sounds[name]) {
      return true;
    }
    return false;
  }

  //新增资源
  /*
   例子：
   parseLib.addResources(app,[{ alias: "logo", source: "assets/tiktok-logo.svg", options: { loadType: 2, xhrType: 'document' }},{ alias: "cat", source: "assets/cat.jpg", options: { loadType: 2, xhrType: 'blob' }}]);
   parseLib.addResources(app,{ alias: "logo", source: "assets/tiktok-logo.svg", options: { loadType: 2, xhrType: 'document' }});
*/
  function addResources(app, resources, callback) {
    var soundes = app.soundes;
    let tempResources = JSON.parse(JSON.stringify(resources));
    var _resources = [];
    if (Array.isArray(resources)) {
      _resources = [...resources];
    } else {
      _resources.push(resources);
    }
    soundes.loading = 0;
    soundes.loaded = 0;
    resources.forEach(function (resource, id) {
      if (
        !window.allResources[resource.alias] &&
        !isResourceExist(resource.alias)
      ) {
        loader.add(resource.alias, resource.source, resource.options);
        if (
          resource.options &&
          resource.options.metadata &&
          resource.options.metadata.type
        ) {
          if (convertLowerCase(resource.options.metadata.type) == 'audio') {
            soundes.loading = soundes.loading + 1;
          }
        }
      }
    });

    loader.load(function (loader, resources) {
      Object.assign(window.allResources, resources);
      loader.reset();
      for (let index in tempResources) {
        let resource = tempResources[index];
        let res = resources[resource.alias];
        console.log('加载完成：', resource.alias);
        if (res) {
          switch (res.type) {
            case PIXI.LoaderResource.TYPE.IMAGE:
              break;
            case PIXI.LoaderResource.TYPE.VIDEO:
              break;
            case PIXI.LoaderResource.TYPE.AUDIO:
              console.log('load audio, name:' + index + ', time:' + Date.now());
              break;
            case PIXI.LoaderResource.TYPE.TEXT:
              break;
            case PIXI.LoaderResource.TYPE.JSON:
              break;
            case PIXI.LoaderResource.TYPE.XML:
              break;
            case PIXI.LoaderResource.TYPE.UNKNOWN:
              //console.log("load UNKNOWN, name:" + name + ", time:" + Date.now())
              if (
                res.metadata &&
                res.metadata.type &&
                convertLowerCase(res.metadata.type) == 'audio'
              ) {
                console.log(
                  'load UNKNOWN, name:' + res.alias + ', time:' + Date.now(),
                );
                soundes.add(res.alias || res.name, {
                  preload: true,
                  source: res.data,
                  loaded: function () {
                    console.log('loaded ext:' + res.extension);
                    soundes.loaded = soundes.loaded + 1;
                  },
                });
              }
              break;
            default:
              break;
          }
        }
      }
      app.soundes = soundes;
      if (callback) {
        callback(app, resources);
      }
      //console.log("resources:" + PIXI.window.allResources['center']);
    });
    return true;
  }
  //删除资源
  function delResources(app, data) {
    let resources = window.allResources;
    let soundes = app.soundes._sounds;
    if (convertLowerCase(data.type) === 'video') {
      delete resources[`${data.id}_v`];
      if (data.originVolume) {
        delete resources[`${data.id}_a`];
        delete soundes[`${data.id}_a`];
      }
    } else if (convertLowerCase(data.type) === 'audio') {
      delete resources[`${data.id}`];
      delete soundes[`${data.id}`];
    }
  }

  function loadResources(app, prj, callback) {
    window.transitionLib.addAllResource();
    window.filterLib.addAllResource();
    var soundes = app.soundes;
    soundes.loading = 0;
    soundes.loaded = 0;
    // Add to the PIXI loader
    prj.resources.forEach(function (resource, id) {
      if (!isResourceExist(resource.alias)) {
        loader.add(resource.alias, resource.source, resource.options);
        if (
          resource.options &&
          resource.options.metadata &&
          resource.options.metadata.type
        ) {
          if (
            !app.soundLoaded &&
            convertLowerCase(resource.options.metadata.type) == 'audio'
          ) {
            soundes.loading = soundes.loading + 1;
          }
        }
      }
    });

    loader.load(function (loader, resources) {
      Object.assign(window.allResources, resources);
      loader.reset();
      for (let name in resources) {
        let res = resources[name];
        switch (res.type) {
          case PIXI.LoaderResource.TYPE.IMAGE:
            break;
          case PIXI.LoaderResource.TYPE.VIDEO:
            break;
          case PIXI.LoaderResource.TYPE.AUDIO:
            console.log('load audio, name:' + name + ', time:' + Date.now());
            break;
          case PIXI.LoaderResource.TYPE.TEXT:
            break;
          case PIXI.LoaderResource.TYPE.JSON:
            break;
          case PIXI.LoaderResource.TYPE.XML:
            break;
          case PIXI.LoaderResource.TYPE.UNKNOWN:
            //console.log("load UNKNOWN, name:" + name + ", time:" + Date.now())
            if (
              !app.soundLoaded &&
              res.metadata &&
              res.metadata.type &&
              convertLowerCase(res.metadata.type) == 'audio'
            ) {
              console.log(
                'load UNKNOWN, name:' + name + ', time:' + Date.now(),
              );
              soundes.add(name, {
                preload: true,
                source: res.data,
                loaded: function () {
                  console.log('loaded ext:' + res.extension);
                  soundes.loaded = soundes.loaded + 1;
                },
              });
            }
            break;
          default:
            break;
        }
      }
      app.soundes = soundes;
      if (callback) {
        callback(app, prj);
      }
      //console.log("resources:" + PIXI.window.allResources['center']);
    });
  }

  function freeResources(app) {
    // window.allResources = {};
    window.transitionLib.freeAllResource(app);
    window.filterLib.freeAllResource(app);
    if (app.soundes && app.soundes.close) {
      app.soundes.close();
    }
  }

  /*
//
record:
true  收录模式
false 展示模式
soundLoaded: true 表示音频已经加载
*/
  function loadProject(
    prj,
    record = false,
    offline = false,
    soundLoaded = false,
  ) {
    console.log(prj, prj.width, prj.height);
    const app = new PIXI.Application({
      width: prj.width,
      height: prj.height,
      backgroundColor: prj.backgroundColor,
      autoStart: false,
      resolution: 1,
      // antialias: true,     //消除锯齿
    });
    app.stage.sortableChildren = true;
    //自定义属性
    app.duration = prj.duration;
    app.soundLoaded = soundLoaded;
    app.record = record;
    app.offline = offline;
    app.width = prj.width;
    app.height = prj.height;
    app.fps = prj.fps || 30;

    //创建sound library,管理sound
    let soundes = PIXI.sound(
      prj.duration,
      offline
        ? {
            numberOfChannels: 2,
            sampleRate: 44100,
            bitrate: 128000,
          }
        : record,
    );
    app.soundes = soundes;
    //加载资源
    setTimeout(() => {
      loadResources(app, prj, parseProject);
    }, 0);
    // Stop application wait for trigger
    app.stop();
    return app;
  }

  function closeProject(app) {
    stop(app);
    freeResources(app);
    app.soundes = null;
    app = null;
  }

  function start(app, start = 0, status = 'play') {
    let last = null;
    let lastMillis = -1;
    if (!app.started) {
      app.start();
      app.started = true;
    }
    app.millis = start;
    app.status = status;

    if (app.loop) {
      app.ticker.remove(app.loop);
      app.loop = null;
    }
    //timeline 触发定时器, 时钟驱动的状态机
    function loop(delta) {
      if (app.soundes.loaded == app.soundes.loading) {
        if (!last) {
          last = Date.now();
        }
        let elapsed = Date.now() - last;
        last = Date.now();
        let seeking = false;
        //根据app状态，处理相关行为
        switch (app.status) {
          case 'pause':
            return;
            break;
          case 'seek':
            if (app.millis < 0) {
              app.millis = 0;
            }
            if (!app.paused) {
              stopItem(app); //暂停video controls play, audio play
              app.paused = true;
              return;
            }
            seeking = true;
            break;
          case 'play':
            if (app.millis < 0) {
              app.millis = 0;
            }
            //播放状态, app当前时间戳更新
            if (app.millis <= app.duration * 1000) {
              if (app.millis + elapsed > app.duration * 1000) {
                if (!app.paused) {
                  stopItem(app);
                  app.paused = true;
                  app.millis = app.millis + elapsed;
                  if (callBacks['progress']) {
                    callBacks['progress'](app.millis);
                  }
                  return;
                }
              }
              app.millis = app.millis + elapsed;
              if (callBacks['progress']) {
                callBacks['progress'](app.millis);
              }
              app.paused = false;
            } else {
              stop(app);
              // 设置操作界面播放状态
              if (callBacks['stop']) {
                callBacks['stop']();
              }
              if (app.soundes) {
                app.soundPlayed = false;
                app.soundes.stopAll();
              }
            }
            break;
          default:
            break;
        }
        let refresh = false;
        //app当前时间戳变化或需要刷新显示时，则重新渲染所有container,
        // console.log(app.millis,app.duration * 1000,lastMillis !== app.millis,app.itemRefreshed);

        if (
          (app.millis <= app.duration * 1000 && lastMillis !== app.millis) ||
          app.itemRefreshed
        ) {
          lastMillis = app.millis;
          refresh = true;
          app.itemRefreshed = false;
        }

        if (refresh) {
          let trackContainers = app.stage.children;
          trackContainers.forEach(function (trackContainer, id) {
            var containers = trackContainer.children;
            containers.forEach(function (item, id) {
              if (item.isSprite) {
                if (item.transition && id > 0) {
                  let next = containers[id - 1];
                  if (next.isSprite) {
                    if (convertLowerCase(item.type) === 'image') {
                      renderImageSpriteWithTransition(
                        item,
                        next,
                        app.millis,
                        seeking,
                      );
                    } else {
                      renderSpriteWithTransition(
                        item,
                        next,
                        app.millis,
                        seeking,
                      );
                    }
                  }
                } else {
                  if (convertLowerCase(item.type) === 'image') {
                    renderImage(item, app.millis, seeking);
                  } else {
                    renderSprite(item, app.millis, seeking);
                  }
                }
              } else {
                //console.log("not isSprite, id:" + id + ", item.zIndex:" + item.zIndex);
                renderMotion(item, app.millis, seeking);
              }
            });
          });
        }

        //音频没有播放，则按app当前时间戳播放音频
        if (
          !app.soundPlayed &&
          app.status === 'play' &&
          !app.paused &&
          app.millis < parseInt(app.duration * 1000)
        ) {
          console.log(
            'sound play start:' + app.millis / 1000.0,
            parseInt(app.duration * 1000),
          );
          if (!app.offline) app.soundes.seek(app.millis / 1000.0);
          app.soundPlayed = true;
        }
      } else {
        console.log(
          'app.soundes.loading:' +
            app.soundes.loading +
            ', app.soundes.loaded:' +
            app.soundes.loaded,
        );
      }
    }

    app.loop = loop;
    app.ticker.add(app.loop);
  }

  function recordLoop(app) {
    if (app.soundes.loaded == app.soundes.loading) {
      let trackContainers = app.stage.children;
      let renderOneFinish = true;
      trackContainers.forEach(function (trackContainer, id) {
        var containers = trackContainer.children;
        containers.forEach(function (item, id) {
          if (item.isSprite) {
            if (item.transition && id > 0) {
              let next = containers[id - 1];
              if (next.isSprite) {
                if (convertLowerCase(item.type) === 'image') {
                  if (
                    !renderImageSpriteWithTransition(
                      item,
                      next,
                      app.millis,
                      false,
                    )
                  ) {
                    renderOneFinish = false;
                  }
                } else {
                  if (
                    !renderSpriteWithTransition(item, next, app.millis, false)
                  ) {
                    renderOneFinish = false;
                  }
                }
              }
            } else {
              if (convertLowerCase(item.type) === 'image') {
                renderImage(item, app.millis);
              } else {
                if (!renderSprite(item, app.millis, false)) {
                  renderOneFinish = false;
                }
              }
            }
          } else {
            renderMotion(item, app.millis, false);
          }
        });
      });

      if (app.recordStop) {
        trackContainers.forEach(function (trackContainer, id) {
          var containers = trackContainer.children;
          containers.forEach(function (item, id) {
            if (item.isSprite && item.decoder) {
              item.decoder.stop();
              item.decoder = null;
            }
          });
        });

        // app.soundes.close();
        app.recorder.stopCapture();
        return;
      }

      if (app.millis >= app.duration * 1000 || (app.record && app.recordDone)) {
        trackContainers.forEach(function (trackContainer, id) {
          var containers = trackContainer.children;
          containers.forEach(function (item, id) {
            if (item.isSprite && item.decoder) {
              item.decoder.stop();
              item.decoder = null;
            }
          });
        });
        // app.soundes.close();
        console.info('time:' + Date.now() + ' record finish');
        app.recorder.endCapture();
        return;
      }

      if (renderOneFinish) {
        app.renderer.render(app.stage);
        app.millis += 1000 / app.fps;
        app.recorder.captureFrame(recordLoop, app, app.millis);
      } else {
        //setTimeout(recordLoop, 1000/app.outFps);
        setTimeout(recordLoop, 5, app);
      }
    } else {
      setTimeout(recordLoop, 1000 / app.fps, app);
    }
  }

  function startRecord(app, outFileName = 'out.mp4') {
    app.recordDone = false;
    app.recordStop = false;
    app.millis = 0;
    // let fps = window.getFpsByDiamension(app.view.width, app.view.height);
    //MediaRecord收录模式,fps是解码频率，需要的options子项为 duration; simd收录模式,fps是真正导出的视频的fps，options所有子项都需要
    let gl = app.view.getContext('webgl2');
    let options = {
      fps: app.fps,
      duration: app.duration,
      width: app.width,
      height: app.height,
      speed: 10,
      kbps: calBitrate(app.width, app.height, false),
    };

    app.recorder = new window.MediaExport(
      gl,
      options,
      (audioProgressCb) => {
        let pAACFilename = window.allocateUTF8('aac.mp4');
        return new Promise(function (resolve, reject) {
          app.soundes.mix(window.Module, pAACFilename, audioProgressCb, () => {
            let aacData = app.soundes.getAacData(window.Module, pAACFilename);
            let blob;
            let isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent,
            );
            if (isSafari) {
              blob = new Blob([aacData], {
                type: 'application/octet-stream',
              }).slice(0, aacData.length);
            } else {
              blob = new Blob([aacData], {
                type: 'application/octet-binary',
              }).slice(0, aacData.length);
            }
            resolve(blob);
          });
        });
      },
      (prog) => {
        // 发送millis，导出进度条
        if (callBacks['exportProgress']) {
          callBacks['exportProgress'](prog);
        }
      },
      (ret, blob) => {
        if (ret > 0) {
          // 导出完成
          if (callBacks['recordFinish']) {
            callBacks['recordFinish']();
          }
          let a = document.createElement('a');
          let url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = outFileName;
          a.click();
          window.URL.revokeObjectURL(url);
        } else if (ret < 0) {
          // 导出错误
          if (callBacks['recordFail']) {
            callBacks['recordFail']();
          }
        }
      },
    );
    app.recorder.startCapture(() => {
      recordLoop(app);
    });
    console.info('time:' + Date.now() + ' recordLoop start');
  }

  function stopRecord(app) {
    if (app.record && app.recorder) {
      app.recordStop = true;
      if (window.exportApp) {
        window.exportApp = null;
      }
    }
  }

  function calBitrate(width, height, high) {
    // hign: 高质量
    let bitrateTable = [
      {
        size: 420 * 240,
        bitrate: 576,
      },
      {
        size: 640 * 360,
        bitrate: 896,
      },
      {
        size: 768 * 432,
        bitrate: 1088,
      },
      {
        size: 848 * 480,
        bitrate: 1216,
      },
      {
        size: 1024 * 576,
        bitrate: 1856,
      },
      {
        size: 1280 * 720,
        bitrate: 2496,
      },
      {
        size: 1920 * 1080,
        bitrate: 4992,
      },
    ];

    let highBitrateTable = [
      {
        size: 848 * 480,
        bitrate: 1536,
      },
      {
        size: 1024 * 576,
        bitrate: 2176,
      },
      {
        size: 1280 * 720,
        bitrate: 3072,
      },
      {
        size: 1920 * 1080,
        bitrate: 7552,
      },
    ];

    let size = width * height;
    let bitTable;
    let i;
    if (high) {
      bitTable = highBitrateTable;
    } else {
      bitTable = bitrateTable;
    }

    for (i = 0; i < bitTable.length - 1; i++) {
      if (size <= bitTable[i].size) {
        return bitTable[i].bitrate;
      } else if (bitTable[i].size < size && size <= bitTable[i + 1].size) {
        return bitTable[i + 1].bitrate;
      }
    }

    return bitTable[bitTable.length - 1].bitrate;
  }

  function resumeItem(app) {
    let trackContainers = app.stage.children;
    if (trackContainers) {
      trackContainers.forEach(function (trackContainer, id) {
        let containers = trackContainer.children;
        if (containers) {
          containers.forEach(function (item, id) {
            if (
              item.isSprite &&
              item.startTime * 1000 < app.millis &&
              item.endTime * 1000 > app.millis
            ) {
              if (
                item.texture.baseTexture.resource instanceof PIXI.VideoResource
              ) {
                if (!item.playing) {
                  let controler = item.texture.baseTexture.resource.source;
                  if (controler.paused) {
                    controler.play();
                  }
                  item.playing = true;
                }
              }
            }
          });
        }
      });
    }
  }

  function stopItem(app) {
    let trackContainers = app.stage.children;
    if (trackContainers) {
      trackContainers.forEach(function (trackContainer, id) {
        let containers = trackContainer.children;
        if (containers) {
          containers.forEach(function (item, id) {
            //console.log("id:" + id + ", item.zIndex:" + item.zIndex);
            if (item.isSprite) {
              if (
                item.texture.baseTexture.resource instanceof PIXI.VideoResource
              ) {
                if (item.playing) {
                  let controler = item.texture.baseTexture.resource.source;
                  if (!controler.paused) {
                    controler.pause();
                  }
                  item.playing = false;
                }
              }
            } else {
              //console.log("not isSprite, id:" + id + ", item.zIndex:" + item.zIndex);
              //停止motion
              item.playing = false;
            }
          });
        }
      });
    }
    if (app.soundes) {
      app.soundPlayed = false;
      app.soundes.stopAll();
    }
  }

  function stop(app) {
    if (app.soundes && app.soundes.loaded == app.soundes.loading) {
      console.log('stop...');
      //处理子项
      stopItem(app);
      app.started = false;
      app.status = 'stop';
      app.stop();
    }
  }

  function play(app, start_time = 0) {
    if (!app.started) {
      start(app, start_time);
      app.started = true;
    } else {
      app.millis = start_time;
      app.status = 'play';
    }
  }

  function seek(app, start_time) {
    if (!app.started) {
      start(app, start_time, 'seek');
      app.started = true;
    } else {
      app.millis = start_time;
      app.status = 'seek';
    }
    if (!app.offline && app.soundes) {
      app.soundes.stopAll();
      app.soundPlayed = false;
    }
  }

  function pause(app) {
    if (app.soundes.loaded == app.soundes.loading) {
      stopItem(app);
      app.status = 'pause';
    }
  }

  function resume(app) {
    resumeItem(app);
    app.status = 'play';
  }

  // 转换为小写
  function convertLowerCase(str) {
    if (str) {
      return str.toLowerCase() || '';
    }
  }

  function setCallBack(items) {
    items.forEach(function (item, index, array) {
      switch (item.type) {
        case 'parseItem':
          callBacks[item.type] = item.call;
          break;
        case 'parsed':
          callBacks[item.type] = item.call;
          break;
        case 'progress':
          callBacks[item.type] = item.call;
          break;
        case 'stop':
          callBacks[item.type] = item.call;
          break;
        case 'exportParsed':
          callBacks[item.type] = item.call;
          break;
        case 'exportProgress':
          callBacks[item.type] = item.call;
          break;
        case 'recordFinish':
          callBacks[item.type] = item.call;
          break;
        case 'recordFail':
          callBacks[item.type] = item.call;
          break;
        default:
          break;
      }
    });
  }

  //项目
  parseLib.loadProject = loadProject;
  parseLib.closeProject = closeProject;
  parseLib.start = start;
  parseLib.startRecord = startRecord;
  parseLib.stopRecord = stopRecord;
  parseLib.play = play;
  parseLib.stop = stop;
  parseLib.seek = seek;
  parseLib.pause = pause;
  parseLib.resume = resume;

  //资源
  parseLib.isResourceExist = isResourceExist;
  parseLib.isAudioResourceExist = isAudioResourceExist;
  parseLib.addResources = addResources;
  parseLib.loadResources = loadResources;
  parseLib.delResources = delResources;

  //字幕
  parseLib.parseSrt = parseSrt;
  parseLib.parseSubtitle = parseSubtitle; //从项目中解释字幕
  parseLib.addSubtitle = addSubtitle; //以Subtitle json对象新增字幕
  parseLib.removeSubtitle = removeSubtitle; //清除现有字幕
  parseLib.updateSubtitle = updateSubtitle;

  //滤镜
  parseLib.parseVideoFilters = parseVideoFilters;
  parseLib.removeVideoFilter = removeVideoFilter;
  parseLib.update3dlutFilter = update3dlutFilter;

  //转场
  parseLib.parseTransition = parseTransition;
  parseLib.removeTransition = removeTransition;
  parseLib.updateTransition = updateTransition;

  // 更新音频效果
  parseLib.updateAudioEffect = updateAudioEffect;

  //application 节点维护
  parseLib.addNode = addNode;
  parseLib.updateNode = updateNode;
  parseLib.removeFromStage = removeFromStage;
  parseLib.addContainer = addContainer;

  //项目json节点维护
  parseLib.getJsonNodes = getJsonNodes;
  parseLib.addJsonNode = addJsonNode;

  //关键节点的回调
  parseLib.setCallBack = setCallBack;
})(PIXI, (parseLib = parseLib || {}));
var parseLib;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadProject: parseLib.loadProject,
    closeProject: parseLib.closeProject,
    start: parseLib.start,
    startRecord: parseLib.startRecord,
    play: parseLib.play,
    stop: parseLib.stop,
    stopRecord: parseLib.stopRecord,
    seek: parseLib.seek,
    pause: parseLib.pause,
    resume: parseLib.resume,
    parseSrt: parseLib.parseSrt,
    parseSubtitle: parseLib.parseSubtitle,
    addSubtitle: parseLib.addSubtitle,
    removeSubtitle: parseLib.removeSubtitle,
    updateSubtitle: parseLib.updateSubtitle,
    parseVideoFilters: parseLib.parseVideoFilters,
    removeVideoFilter: parseLib.removeVideoFilter,
    update3dlutFilter: parseLib.update3dlutFilter,
    parseTransition: parseLib.parseTransition,
    removeTransition: parseLib.removeTransition,
    updateTransition: parseLib.updateTransition,
    addNode: parseLib.addNode,
    updateNode: parseLib.updateNode,
    removeFromStage: parseLib.removeFromStage,
    getJsonNodes: parseLib.getJsonNodes,
    addJsonNode: parseLib.addJsonNode,
    addResources: parseLib.addResources,
    loadResources: parseLib.loadResources,
    delResources: parseLib.delResources,
    isResourceExist: parseLib.isResourceExist,
    isAudioResourceExist: parseLib.isAudioResourceExist,
    updateAudioEffect: parseLib.updateAudioEffect,
    setCallBack: parseLib.setCallBack,
    addContainer: parseLib.addContainer,
    library: parseLib,
  };
}
