import { defineStore } from 'pinia';

export const useUsersStore = defineStore("users", {
  // persist: {
  //   storage: persistedState.localStorage
  // },
  state: () => {
    return {
      user: null,
      users: null
    }
  },
  getters: {
    hasUser(state) {
      return state.user != null && state.user.email != null;
    },
    getUser(state) {
      return state.user;
    }
  },
  actions: {
    async userRestore() {
      if (this.user) {
        return Promise.resolve(this.user);
      }
      this.user = null;
      return Promise.resolve();
    },
    async userLogin({email, password}) {
      const Supabase = useSupabaseClient();
      const { data, error } = await Supabase.auth.signInWithPassword({ 
        email: email, 
        password: password 
      });
      if (error) {
        console.error("userLogin", error);
        this.user = null;
        return Promise.reject(error.message);      
      }
      else if (data && data.user) {
        console.log("userLogin", data);
        this.user = data.user;
        return Promise.resolve(this.user);
      }
      else {
        this.user = null;
        return Promise.reject("Unable to login user");
      }
    },
    async userSignup({email, password, name}) {
      const Supabase = useSupabaseClient();
      const { data, error } = await Supabase.auth.signUp({ 
        email: email, 
        password: password 
      });
      if (error) {
        console.error("userSignup", error);
        this.user = null;
        return Promise.reject(error.message);
      }
      else if (data && data.user) {
        console.log("userSignup", data);
        this.user = data.user;
        return Promise.resolve(this.user);
      }
      else {
        this.user = null;
        return Promise.reject("Unable to signup user");
      }
    },
    async userLogout() {
      this.user = null;
      return Promise.resolve();
    }
  }
});
