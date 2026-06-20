import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('data/db.json');

const readData = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      return { users: [], jobs: [], applications: [] };
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [], jobs: [], applications: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to mock database file:', err);
  }
};

export class MockModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async find(query = {}) {
    const data = readData();
    const items = data[this.collectionName] || [];
    return items.filter(item => {
      for (let key in query) {
        const queryVal = query[key];
        const itemVal = item[key];

        // Match field value
        if (queryVal && typeof queryVal === 'object') {
          if ('$regex' in queryVal) {
            const regex = new RegExp(queryVal.$regex, queryVal.$options || '');
            if (!regex.test(itemVal || '')) return false;
          } else if ('$in' in queryVal) {
            const inArray = queryVal.$in;
            if (Array.isArray(itemVal)) {
              if (!itemVal.some(val => inArray.includes(val))) return false;
            } else {
              if (!inArray.includes(itemVal)) return false;
            }
          }
        } else {
          if (itemVal !== queryVal) return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(doc) {
    const data = readData();
    const items = data[this.collectionName] || [];
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    data[this.collectionName] = items;
    writeData(data);
    return newDoc;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const data = readData();
    const items = data[this.collectionName] || [];
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    // Expressing updates (checking flat keys, not MongoDB nesting operators like $set for simplicity)
    const current = items[index];
    const updated = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString()
    };
    
    // If update has nested object profiles, merge them
    if (update.profile && current.profile) {
      updated.profile = {
        ...current.profile,
        ...update.profile
      };
    }

    items[index] = updated;
    data[this.collectionName] = items;
    writeData(data);
    return updated;
  }

  async findByIdAndDelete(id) {
    const data = readData();
    const items = data[this.collectionName] || [];
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    data[this.collectionName] = items;
    writeData(data);
    return deleted;
  }
}
