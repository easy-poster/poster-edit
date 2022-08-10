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
