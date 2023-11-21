import Model from './Model';

export default class User extends Model {

  id = null;

  name = null;
  email = null;

  access_token = null;
  refresh_token = null;

  created_at = null;
  updated_at = null;
  
  constructor(data = {}) {
    super(data);
    Object.assign(this, data);
  }

  async store(current = false) {
    if (current) {
      return this.storeModel("user");
    }
    return this.storeModel(`users/${this.id}`);
  }

  static async restore(id=null) {
    if (id) {
      return Model.restoreModel(User, `users/${id}`);
    }
    return Model.restoreModel(User, "user");
  }

  static async load(id) {
    return Model.loadModel(User, "users", id);
  }

  async save() {
    return this.saveModel(User, "users", ["id", "name", "email"]);
  }

  static async google() {
    const Supabase = useSupabaseClient();
    const { data, error } = await Supabase.auth.signIn({ 
      provider: 'google' 
    });
    if (error) {
      console.error("User.google", error);
    }
    else if (data && data.user && data.session) {
      console.log("User.google", data);
      let user = new User();
      user.id = data.user.id;
      user.email = data.user.email;
      user.created_at = data.user.created_at;
      user.updated_at = data.user.updated_at;
      user.access_token = data.session.access_token;
      user.refresh_token = data.session.refresh_token;
      return user;
    }
    return null;
  }

  static async login(email, password) {
    const Supabase = useSupabaseClient();
    const { data, error } = await Supabase.auth.signInWithPassword({ 
      email: email, 
      password: password 
    });
    if (error) {
      console.error("User.login", error);
    }
    else if (data && data.user && data.session) {
      console.log("User.login", data);
      let user = new User();
      user.id = data.user.id;
      user.email = data.user.email;
      user.created_at = data.user.created_at;
      user.updated_at = data.user.updated_at;
      user.access_token = data.session.access_token;
      user.refresh_token = data.session.refresh_token;
      return user;
    }
    return null;
  }

  static async signup(email, password, name) {
    const Supabase = useSupabaseClient();
    const { data, error } = await Supabase.auth.signUp({ 
      email: email, 
      password: password 
    });
    if (error) {
      console.error("User.signup", error);
    }
    else if (data && data.user && data.session) {
      console.log("User.signup", data);
      let user = new User();
      user.id = data.user.id;
      user.email = data.user.email;
      user.name = name;
      user.created_at = data.user.created_at;
      user.updated_at = data.user.updated_at;
      user.access_token = data.session.access_token;
      user.refresh_token = data.session.refresh_token;
      return user;
    }
    return null;
  }

  static async logout() {
    try {
      const Storage = useStorage();
      await Storage.clear();
      
      const Supabase = useSupabaseClient();
      await Supabase.auth.signOut();
    }
    catch (error){
      console.error("User.logout", error);
    }
  }

}