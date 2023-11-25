export default class Models extends Array {

  constructor(modelClass, models = []) {
    super();
    if (models && models.length > 0) {
      for (let model of models) {
        this.push(new modelClass(model));
      }
    }
  }

  static async clearModels(prefix) {
    const Storage = useStorage();
    return await Storage.clear(prefix);
  }

  async save() {
    for (let item of this) {
      if (typeof item.save === 'function') {
        item.save();
      }
    }
  }

  async store() {
    for (let item of this) {
      if (typeof item.store === 'function') {
        item.store();
      }
    }
  }

}