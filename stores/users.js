import { defineStore } from 'pinia';

import User from "../models/User";

export const useUserStore = defineStore("users", {
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
      let user = await User.restore();
      console.log("userRestore", user);
      if (user) {
        this.user = user;
        return Promise.resolve(user);
      }
      else {
        this.user = null;
        return Promise.resolve(null);
      }
    },
    async googleSignin() {
      try {
        let user = await User.google();
        if (user) {
          user = await user.save();
          user = await user.store(true);
          user = await User.load(user.id);
        }
        this.user = user;
        return Promise.resolve(user);
      }
      catch (error) {
        console.error("googleSignin", error);
        return Promise.reject(error);
      }
    },
    async userLogin({email, password}) {
      try {
        console.log("userLogin", email);
        let user = await User.login(email, password);
        if (user) {
          user = await user.save();
          user = await user.store(true);
        }
        this.user = user;
        return Promise.resolve(user);
      }
      catch (error) {
        console.error("userLogin", error);
        return Promise.reject(error);
      }
    },
    async userSignup({email, password, name}) {
      try {
        let user = await User.signup(email, password, name);
        if (user) {
          user = await user.save();
          user = await user.store(true);
        }
        this.user = user;
        return Promise.resolve(user);
      }
      catch (error) {
        console.error("userSignup", error);
        return Promise.reject(error);
      }
    },
    async userLogout() {
      try {
        await User.logout();
        return Promise.resolve();
      }
      catch (error) {
        console.error("userLogout", error);
        return Promise.reject(error);
      }
    }
  }
});
