import * as localForage from "localforage";
export class Storage {

  static _instance;

  static instance() {
    if (!this._instance) {
      this._instance = new Storage();
    }
    return this._instance;
  }

  constructor(name=null) {
    console.log("services/storage", process.client ? "client" : "server")
    if (process.client) {
      localForage.config({
        driver: [
          localForage.INDEXEDDB,
          localForage.WEBSQL,
          localForage.LOCALSTORAGE
        ],
        name: name || this.configAppName()
      });
    }
  }

  async keys(prefix = null) {
    if (process.client) {
      if (prefix && prefix.length > 0) {
        let keys = await localForage.keys();
        return keys.filter(key => key.startsWith(prefix));
      }
      return await localForage.keys();
    }
    return [];
  }

  async get(key) {
    if (process.client) {
      return await localForage.getItem(key);
    }
    return null;
  }

  async set(key, value) {
    if (process.client) {
      if (value) {
        return await localForage.setItem(key, value);
      }
      return await localForage.setItem(key, null);
    }
    return null;
  }

  async count(prefix, needle = "", haystack = null, filters = {}) {
    if (process.client) {
      let counts = 0;
      let keys = await this.keys(prefix);
      let search = needle && needle.length > 0 ? needle.toLowerCase() : "";
      for (let key of keys) {
        const item = await this.get(key);
        if (item) {
          if (search && search.length > 0) {
            if (haystack && haystack.length > 0) {
              for (let attribute of haystack.split(",")) {
                let value = item[attribute];
                if (value && Array.isArray(value) && value.includes(search)) {
                  counts = counts + 1;
                  break;
                }
                else if (value && value.toString().toLowerCase().indexOf(search) != -1) {
                  counts = counts + 1;
                  break;
                }
              }
            }
            else {
              for (let value of Object.values(item)) {
                if (value && value.toString().toLowerCase().indexOf(search) != -1) {
                  counts = counts + 1;
                  break;
                }
              }
            }
          }
          else {
            counts = counts + 1;
          }
        }
      }
      return counts;
    }
    return 0;
  }

  async search(prefix, needle = "", haystack = null, offset = 0, limit = 100, sort = null) {
    if (process.client) {
      let results = [];
      let keys = await this.keys(prefix);
      let search = needle && needle.length > 0 ? needle.toLowerCase() : "";
      for (let key of keys) {
        const item = await this.get(key);
        if (item) {
          if (search && search.length > 0) {
            if (haystack && haystack.length > 0) {
              for (let attribute of haystack.split(",")) {
                let value = item[attribute];
                if (value && Array.isArray(value) && value.includes(search)) {
                  results.push(item);
                  break;
                }
                else if (value && value.toString().toLowerCase().indexOf(search) != -1) {
                  results.push(item);
                  break;
                }
              }
            }
            else {
              for (let value of Object.values(item)) {
                if (value && value.toString().toLowerCase().indexOf(search) != -1) {
                  results.push(item);
                  break;
                }
              }
            }
          }
          else {
            results.push(item);
          }
        }
      }
      if (sort && sort.length > 0) {
        return results.sort(sortByProperties(sort.split(","))).slice(offset, offset + limit);
      }
      return results.slice(offset, offset + limit);
    }
    return [];
  }

  async remove(key) {
    if (process.client) {
      return await localForage.removeItem(key);
    }
    return null;
  }

  async clear(prefix = null) {
    if (process.client) {
      if (prefix && prefix.length > 0) {
        let keys = await this.keys(prefix);
        for (let key of keys) {
          await localForage.removeItem(key);
        }
        return true;
      }
      return await localForage.clear();
    }
    return null;
  }

  sortByProperties(properties) {
    if (process.client) {
      return (a, b) => {
        let i = 0;
        let result = 0;
        let numberOfProperties = properties.length;
        while (result === 0 && i < numberOfProperties) {
          result = this.sortByProperty(properties[i])(a, b);
          i++;
        }
        return result;
      };
    }
    return [];
  }

  sortByProperty(property) {
    if (process.client) {
      let sortOrder = 1;
      if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1, property.length - 1);
      }
      return (a, b) => {
        if (typeof a[property] == "boolean") {
          return ((a[property] === b[property]) ? 0 : a[property] ? -1 : 1) * sortOrder;
        }
        if (typeof a[property] == "number") {
          return (a[property] - b[property]) * sortOrder;
        }
        return ((a[property] < b[property]) ? -1 : (a[property] > b[property])) * sortOrder;
      };
    }
    return [];
  }

  configAppName() {
    const config = useRuntimeConfig();
    if (config && config.public && config.public.app && config.public.app.name) {
      console.log("configAppName", config.public.app.name);
      return config.public.app.name;
    }
    return process.env.APP_NAME;
  }

}