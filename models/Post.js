import Model from './Model';

export default class Post extends Model {

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
    return Model.restoreModel(Post, `posts/${id}`);
  }

  static async load({id}) {
    if (id) {
      return Model.loadModel(Post, "posts", id, "id");
    }
    return null;
  }

  async save() {
    let attributes = this.getAttributes();
    return this.saveModel(Post, "posts", attributes);
  }

}