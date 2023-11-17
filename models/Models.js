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

  static async loadModels(collectionClass, modelClass, table, order, limit = 10, offset = 0, clauses = [], select = '*') {
    const Supabase = useSupabaseClient();
    let collection = new collectionClass();
    let query = Supabase.from(table).select(select);
    query = query.range(offset, offset+limit-1);
    if (clauses && clauses.length > 0) {
      for (let clause of clauses) {
        let column = clause.at(0);
        let operator = clause.at(1);
        let value = clause.at(2);
        console.log(`loadModels query`, {
          column: column,
          operator: operator,
          value: value
        })
        if (operator == "eq") {
          query = query.eq(column, value);
        }
        else if (operator == "gt") {
          query = query.gt(column, value);
        }
        else if (operator == "lt") {
          query = query.lt(column, value);
        }
        else if (operator == "gte") {
          query = query.gte(column, value);
        }
        else if (operator == "lte") {
          query = query.lte(column, value);
        }
        else if (operator == "ilike") {
          query = query.ilike(column, `%${value}%`);
        }
        else if (operator == "like") {
          query = query.like(column, `%${value}%`);
        }
        else if (operator == "is") {
          query = query.is(column, value);
        }
        else if (operator == "in") {
          query = query.in(column, value);
        }
        else if (operator == "cs") {
          query = query.cs(column, value);
        }
        else if (operator == "cd") {
          query = query.cd(column, value);
        }
      }
    }
    if (order) {
      let sorting = order.split(":");
      let ordering = sorting.at(0);
      let ascending = sorting.length > 1 && sorting.at(1) == "asc";
      query = query.order(ordering, { ascending: ascending })
    }
    const { data, error } = await query;
    if (error) {
      console.error("loadModels", error);
    }
    else if (data && data.length > 0) {
      console.log(`loadModels ${table}`, data)
      for (let item of data) {
        let model = new modelClass(item);
        collection.push(model);
      }
    }
    return collection;
  }

}