export default class Model {

  constructor(data = {}) {
    Object.assign(this, data);
  }

  async remove() {
    return null;
  }

  async removeModel(key) {
    const Storage = useStorage();
    return await Storage.remove(key);
  }

  async store() {
    return null;
  }

  async storeModel(key) {
    const Storage = useStorage();
    if (this.deleted_at && this.deleted_at.length > 0) {
      await Storage.remove(key);
      return null;
    }
    else {
      const json = JSON.stringify(this);
      const data = JSON.parse(json);
      await Storage.set(key, data);
      return this;
    }
  }

  static async restore(key) {
    return null;
  }

  static async restoreModel(modelClass, key) {
    const Storage = useStorage();
    let data = await Storage.get(key);
    if (data) {
      let model = new modelClass(data);
      return model;
    }
    return null;
  }

  getAttributes() {
    return Object.keys(this).filter(key => key != "id" && key.endsWith("_count") == false && key.endsWith("_at") == false);
  }

  getValues(attributes=[]) {
    let values = {}
    let keys = Object.keys(this).filter(key => attributes.includes(key));
    for (let key of keys) {
      if (this[key] != null) {
        values[key] = this[key];
      }
    }
    return values;
  }

}