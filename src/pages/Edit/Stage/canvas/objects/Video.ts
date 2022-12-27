import { fabric } from 'fabric';

export interface VideoObject extends FabricElement {
    setSource: (source: string | File) => void;
    setFile: (file: File) => void;
    setSrc: (src: string) => void;
    file?: File;
    src?: string;
    videoElement?: HTMLVideoElement;
    player?: any;
}

const Video = fabric.util.createClass(fabric.Rect, {
    type: 'video',
    superType: 'element',
    hasRotatingPoint: false,
    initialize(source: string | File, options: any = {}) {
        this.callSuper('initialize', options);
        if (source instanceof File) {
            this.set({
                file: source,
                src: null,
            });
        } else {
            this.set({
                file: null,
                src: source,
            });
        }
        this.set({
            fill: 'rgba(255, 255, 255, 0)',
            stroke: 'rgba(255, 255, 255, 0)',
        });
    },
});

Video.fromObject = (
    options: VideoObject,
    callback: (obj: VideoObject) => any,
) => {
    return callback(new Video(options.src || options.file, options));
};

export default Video;
