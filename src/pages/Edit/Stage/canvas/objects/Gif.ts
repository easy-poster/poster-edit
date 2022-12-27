import { fabric } from 'fabric';

const Gif = fabric.util.createClass(fabric.Object, {
    type: 'gif',
    superType: 'image',
    gifCanvas: null,
    isStarted: false,
    initialize(options: any = {}) {
        this.callSuper('initialize', options);
        this.gifCanvas = document.createElement('canvas');
    },
});

Gif.fromObject = (options: any, callback: (obj: any) => any) => {
    return callback(new Gif(options));
};

export default Gif;
