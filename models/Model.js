export default class Model {
  id = null;
  
  created_at = null;
  updated_at = null;

  constructor(data = {}) {
    Object.assign(this, data);
  }

  async remove() {
    // implemented by child
    return null;
  }

  async removeModel(key) {
    const Storage = useStorage();
    return await Storage.remove(key);
  }

  async store() {
    // implemented by child
    return null;
  }

  async storeModel(key) {
    const Storage = useStorage();
    if (this.deleted && this.deleted.length > 0) {
      await Storage.remove(key);
      return null;
    }
    else {
      await Storage.set(key, this);
      return this;
    }
  }

  static async restore(id) {
    // implemented by child
    return null;
  }

  static async restoreModel(modelClass, key) {
    const Storage = useStorage();
    console.log("restoreModel", Storage);
    let value = await Storage.get(key);
    if (value) {
      let model = new modelClass(value);
      return model;
    }
    return null;
  }

  static async load(id) {
    // implemented by child
    return null;
  }

  static async loadModel(modelClass, table, id, column = "id") {
    const Supabase = useSupabaseClient();
    let { data, error } = await Supabase.from(table).select("*").eq(column, id).single();
    if (error) {
      if (error.code != "PGRST116") {
        console.error("loadModel", error);
      }
    }    
    else if (data) {
      console.info("loadModel", data);
      let model = new modelClass(data);
      return model;
    }
    return null;
  }

  async save() {
    // implemented by child
    return null;
  }

  async saveModel(modelClass, table, attributes = [], keys = ['id']) {
    const Supabase = useSupabaseClient();
    let values = this.getValues(attributes);
    if (this.id && this.id.length > 0) {
      let query = Supabase.from(table).upsert(values);
      for (let key in keys) {
        query = query.eq(key, this[key]);
      }
      const { data, error } = await query.select()
      if (error) {
        console.error("saveModel", error);
      }    
      else if (data) {
        console.info("saveModel", data.at(0));
        let model = new modelClass(data.at(0));
        return model;
      }
      return null;
    }
    else {
      const { data, error } = await Supabase.from(table).insert(values).select()
      if (error) {
        console.error("saveModel", error);
      }    
      else if (data) {
        console.info("saveModel", data.at(0));
        let model = new modelClass(data.at(0));
        return model;
      }
      return null;
    }
  }

  async deleteModel(modelClass, table, id) {
    const Supabase = useSupabaseClient();
    const { error } = await Supabase.from(table).delete().eq('id', id);
    if (error) {
      console.log("deleteModel", error);
    }
  }

  getAttributes() {
    return Object.keys(this).filter(key => key != "id" && !key.endsWith("_count") && !key.endsWith("_at"));
  }

  getValues(attributes=[]) {
    let values = {}
    let keys = Object.keys(this).filter(key => attributes.includes(key));
    for (let key of keys) {
      values[key] = this[key];
    }
    return values;
  }

}