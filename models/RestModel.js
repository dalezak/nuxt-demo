import Model from './Model';

export default class RestModel extends Model {

  constructor(data = {}) {
    super(data);
    Object.assign(this, data);
  }
  
  static async load(id) {
    return null;
  }

  async save() {
    return null;
  }

  async delete() {
    return false;
  }

  static async loadModel(modelClass, url, params = {}) {
    const { error, data: response } = await useFetch(url, {
      key: RestModel.urlQuery(url, params),
      params: params,
      initialCache: false
    });
    if (error.value) {
      console.error("RestModel.loadModel", error.value);
      return null;
    }
    else if (response.value) {
      console.log("RestModel.loadModel", response.value);
      let model = new modelClass(response.value);
      return model;
    }
    return null;
  }

  async saveModel(modelClass, url, values = {}) {
    const method = this.id != null ? 'put' : 'post';
    const { error, data: response } = await useFetch(url, {
      method: method,
      body: values
    });
    if (error.value) {
      console.error("RestModel.saveModel", error.value);
      return null;
    }
    else if (response.value) {
      console.log("RestModel.saveModel", response.value);
      let model = new modelClass(response.value);
      return model;
    }
    return null;
  }

  async deleteModel(modelClass, url) {
    const { error, data: response } = await useFetch(url, {
      method: 'delete'
    });
    if (error.value) {
      console.error("RestModel.deleteModel", error.value);
      return false;
    }
    else if (response.value) {
      console.log("RestModel.deleteModel", response.value);
      return true;
    }
    return false;
  }

  static urlQuery(url, params ={}) {
    const urlPath = new URL(url);
    for (let key in params) {
      urlPath.searchParams.append(key, params[key]);
    }
    return urlPath.href;
  }

}