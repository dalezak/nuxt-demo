import Models from './Models';

export default class SupaModels extends Models {

  constructor(models = []) {
    super(models);
  }

  static async loadModels(collectionClass, modelClass, tableName, { limit = 10, offset = 0, order = null, where = [], select = '*' } = {}) {
    const Supabase = useSupabaseClient();
    let collection = new collectionClass();
    let query = Supabase.from(tableName).select(select);
    query = query.range(offset, offset+limit-1);
    if (where && where.length > 0) {
      for (let clause of where) {
        let column = clause.at(0);
        let operator = clause.at(1);
        let value = clause.at(2);
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
    const { data: rows, error } = await query;
    if (error) {
      console.error("SupaModels.loadModels", error);
    }
    else if (rows && rows.length > 0) {
      console.log(`SupaModels.loadModels ${tableName}`, rows);
      for (let row of rows) {
        let model = new modelClass(row);
        collection.push(model);
      }
    }
    return collection;
  }

}