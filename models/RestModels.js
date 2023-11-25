import Models from './Models';

export default class RestModels extends Models {

  constructor(models = []) {
    super(models);
  }

  static async loadModels(collectionClass, modelClass, url, params = {}) {
    let collection = new collectionClass();
    const { error, data: results } = await useFetch(url, {
      key: RestModels.urlQuery(url, params),
      params: params,
      initialCache: false
    });
    if (error.value) {
      console.error("RestModels.loadModels", error.value);
      return null;
    }
    else if (results && results.value) {
      console.log("RestModels.loadModels", results);
      for (let result of results.value) {
        let model = new modelClass(result);
        collection.push(model);
      }
    }
    return collection;
  }

  static urlQuery(url, params ={}) {
    const urlPath = new URL(url);
    if (params) {
      for (let key in params) {
        urlPath.searchParams.append(key, params[key]);
      }
    }
    return urlPath.href;
  }

}