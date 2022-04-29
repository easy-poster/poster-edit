import Dexie, { Table } from 'dexie';

interface commonProps {
  id?: number;
  userId?: number;
  createTime?: Date;
  updateTime?: Date;
}

export interface epProject extends commonProps {
  id?: number;
  title: string;
  blob: Blob;
  cover: string;
}

export interface epImage extends commonProps {
  userId: number;
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
      epImage: '++id, userId, name, size, type, blob, cover',
      epProject: '++id, title, blob, cover',
    });
  }
}

export const db = new EposterDexie('eposterDatabase');
