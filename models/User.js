import SupaModel from './SupaModel';

export default class User extends SupaModel {

  id = null;

  name = null;
  email = null;

  created_at = null;
  updated_at = null;
  
  constructor(data = {}) {
    super(data);
    Object.assign(this, data);
  }

  async store() {
    return await this.storeModel(`users/${this.id}`);
  }

  static async restore(id) {
    return await SupaModel.restoreModel(User, `users/${id}`);
  }

  static async load(id) {
    return await SupaModel.loadModel(User, "users", { id: id });
  }

  async save() {
    return this.saveModel(User, "users", ["id", "name", "email"]);
  }

  static async google() {
    const Supabase = useSupabaseClient();
    const { data: auth, error } = await Supabase.auth.signIn({ 
      provider: 'google' 
    });
    if (error) {
      console.error("User.google", error);
      return null;
    }
    else if (auth && auth.user) {
      console.log("User.google", auth);
      let user = new User();
      user.id = auth.user.id;
      user.email = auth.user.email;
      user.created_at = auth.user.created_at;
      user.updated_at = auth.user.updated_at;
      return user;
    }
    return null;
  }

  static async login(email, password) {
    const Supabase = useSupabaseClient();
    const { data: auth, error } = await Supabase.auth.signInWithPassword({ 
      email: email, 
      password: password 
    });
    if (error) {
      console.error("User.login", error);
      return null;
    }
    else if (auth && auth.user) {
      console.log("User.login", auth);
      let user = new User();
      user.id = auth.user.id;
      user.email = auth.user.email;
      user.created_at = auth.user.created_at;
      user.updated_at = auth.user.updated_at;
      return user;
    }
    return null;
  }

  static async signup(email, password, name) {
    const Supabase = useSupabaseClient();
    const { data: auth, error } = await Supabase.auth.signUp({ 
      email: email, 
      password: password 
    });
    if (error) {
      console.error("User.signup", error);
      return null;
    }
    else if (auth && auth.user) {
      console.log("User.signup", auth);
      let user = new User();
      user.id = auth.user.id;
      user.email = auth.user.email;
      user.name = name;
      user.created_at = auth.user.created_at;
      user.updated_at = auth.user.updated_at;
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
      return true;
    }
    catch (error){
      console.error("User.logout", error);
      return false;
    }
  }

}