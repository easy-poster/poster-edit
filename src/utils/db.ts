import Dexie, { Table } from 'dexie';

interface commonProps {
  id?: number;
  userId?: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface epProject extends commonProps {
  uuid: string; // uuid
  title: string; // 项目名称
  resourceId?: number; // 资源id
  url?: string; // blob 地址
  src?: string; // 在线资源地址
  cover?: string; // 封面
  size?: number; // 资源大小
  width?: number; // 原始宽
  height?: number; // 原始高
  background?: string; // 背景
}

export interface epImage extends commonProps {
  name: string;
  size: number;
  type: string;
  blob: Blob;
  cover?: Blob;
}

export class EposterDexie extends Dexie {
  epProject!: Table<epProject>;
  epImage!: Table<epImage>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      epImage:
        '++id, userId, createTime, updateTime, name, size, type, blob, cover',
      epProject:
        '++id, userId, createTime, updateTime, &uuid, title, resourceId, url, src, cover, size, width, height, background',
    });
  }
}

export const db = new EposterDexie('eposterDatabase');
