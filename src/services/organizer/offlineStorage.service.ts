import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface CheckinDB extends DBSchema {
  queue: {
    key: string;
    value: {
      id: string;
      ticketId: string;
      attendeeName: string;
      timestamp: string;
      retryCount: number;
      eventId: string;
    };
  };
  synced: {
    key: string;
    value: {
      id: string;
      ticketId: string;
      timestamp: string;
    };
  };
}

class OfflineStorageService {
  private db: IDBPDatabase<CheckinDB> | null = null;

  async init() {
    this.db = await openDB<CheckinDB>('checkin-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('queue')) {
          db.createObjectStore('queue', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('synced')) {
          db.createObjectStore('synced', { keyPath: 'id' });
        }
      },
    });
  }

  async addToQueue(item: { id: string; ticketId: string; attendeeName: string; eventId: string }) {
    if (!this.db) await this.init();
    const queueItem = {
      ...item,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    await this.db!.add('queue', queueItem);
  }

  async getQueue(): Promise<any[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('queue');
  }

  async removeFromQueue(id: string) {
    if (!this.db) await this.init();
    await this.db!.delete('queue', id);
  }

  async clearQueue() {
    if (!this.db) await this.init();
    const queue = await this.getQueue();
    for (const item of queue) {
      await this.removeFromQueue(item.id);
    }
  }

  async addSynced(item: { id: string; ticketId: string }) {
    if (!this.db) await this.init();
    await this.db!.add('synced', { ...item, timestamp: new Date().toISOString() });
  }

  async isSynced(ticketId: string): Promise<boolean> {
    if (!this.db) await this.init();
    const item = await this.db!.get('synced', ticketId);
    return !!item;
  }
}

export const offlineStorage = new OfflineStorageService();