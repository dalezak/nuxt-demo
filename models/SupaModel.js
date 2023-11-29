import Model from './Model';

export default class SupaModel extends Model {

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

  static async loadModel(modelClass, table, where = {}) {
    const Supabase = useSupabaseClient();
    let query = Supabase.from(table).select("*");
    for (let key of Object.keys(where)) {
      query = query.eq(key, where[key]);
    }
    let { data: row, error } = await query.single();
    if (error) {
      if (error.code != "PGRST116") {
        console.error("SupaModel.loadModel", error);
      }
      return null;
    }    
    else if (row) {
      console.info("SupaModel.loadModel", row);
      let model = new modelClass(row);
      return model;
    }
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
        console.error("SupaModel.saveModel", error);
      }    
      else if (data) {
        console.info("SupaModel.saveModel", data.at(0));
        let model = new modelClass(data.at(0));
        return model;
      }
      return null;
    }
    else {
      const { data: row, error } = await Supabase.from(table).insert(values).select()
      if (error) {
        console.error("SupaModel.saveModel", error);
      }    
      else if (row) {
        console.info("SupaModel.saveModel", row.at(0));
        let model = new modelClass(row.at(0));
        return model;
      }
      return null;
    }
  }

  async deleteModel(modelClass, table, where = {}) {
    const keys = where ? Object.keys(where) : [];
    if (keys && keys.length > 0) {
      const Supabase = useSupabaseClient();
      let query = Supabase.from(table);
      for (let key in keys) {
        query = query.eq(key, where[key]);
      }
      const { error } = await query.delete();
      if (error) {
        console.log("SupaModel.deleteModel", error);
        return false;
      }
      return true;
    }
    return false;
  }

}