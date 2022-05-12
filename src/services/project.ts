import { db } from '@/utils/db';

export function getProject({ uuid }) {
  return db.epProject.get({ uuid });
}

export function updateLayeres({ id, newLayeres }) {
  return db.epProject.update(id, {
    layeres: newLayeres,
    updateTime: new Date(),
  });
}
