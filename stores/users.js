import { defineStore } from 'pinia';

export const useUsersStore = defineStore("users", {
  state: () => {
    return {
      user: false
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    }
  },
  actions: {
    async userRestore() {
      if (this.user) {
        return Promise.resolve(this.user);
      }
      this.user = false;
      return Promise.resolve();
    },
    async userLogin({email, password}) {
      this.user = true;
      return Promise.resolve(this.user);
    },
    async userSignup({email, password, name}) {
      this.user = true;
      return Promise.resolve(this.user);
    },
    async userLogout() {
      this.user = false;
      return Promise.resolve();
    }
  }
});
