import SupaModel from './SupaModel';

export default class Post extends SupaModel {

  id = null;
  
  title = null;
  body = null;
  image = null;

  created_at = null;
  updated_at = null;
  
  constructor(data = {}) {
    super(data);
    Object.assign(this, data);
  }

  async store() {
    return this.storeModel(`posts/${this.id}`);
  }

  static async restore(id) {
    return SupaModel.restoreModel(Post, `posts/${id}`);
  }

  static async load(id) {
    return SupaModel.loadModel(Post, "posts", { id: id });
  }

  async save() {
    let attributes = this.getAttributes();
    return this.saveModel(Post, "posts", attributes);
  }

}