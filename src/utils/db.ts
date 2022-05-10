import { ItemTypeProps } from '@/const';
import Dexie, { Table } from 'dexie';
import { resourcesProp } from './pixiApp';

interface commonProps {
  id: number;
  userId: number;
  createTime?: Date;
  updateTime?: Date;
}

export type fromType = 'url' | 'resource';

export interface epProject extends commonProps {
  uuid: string; // uuid
  title: string; // 项目名称
  url?: string; // blob 地址
  src?: string; // 在线资源地址
  cover?: string; // 封面
  size?: number; // 资源大小
  width: number; // 原始宽
  height: number; // 原始高
  background: string; // 背景
  resources: Array<resourcesProp>; // 资源
  layeres: Array<layerProps>;
}

export interface epImage extends commonProps {
  name: string;
  size: number;
  type: string;
  blob: Blob;
  cover?: Blob;
}

export interface imageSpriteProps {
  id: string;
  name: string;
  parentId: string;
  type: ItemTypeProps;
  size: number;
  resourceId: number;
  from: fromType;
  src: string;
  url: string;
  rotation: number;
  alpha: number;
  zIndex: number;
  width: number;
  height: number;
  left: number;
  top: number;
  filters: Array<string>;
}

export interface textSpriteProps {
  id: string;
  name: string;
  type: ItemTypeProps;
  size: number;
  rotation: number;
  alpha: number;
  zIndex: number;
  width: number;
  height: number;
  left: number;
  top: number;
}

export interface layerProps {
  id: string;
  type: ItemTypeProps;
  child: Array<imageSpriteProps>;
}

type epProjectFilter = Omit<epProject, 'id'>;
type epImageFilter = Omit<epImage, 'id'>;

export class EposterDexie extends Dexie {
  epProject!: Table<epProjectFilter>;
  epImage!: Table<epImageFilter>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      epImage:
        '++id, userId, createTime, updateTime, name, size, resourceId, type, blob, cover',
      epProject:
        '++id, userId, createTime, updateTime, &uuid, title, url, src, cover, size, width, height, background',
    });
  }
}

export const db = new EposterDexie('eposterDatabase');
