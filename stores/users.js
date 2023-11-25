import { defineStore } from 'pinia';

import Users from "../models/Users";
import User from "../models/User";

export const useUserStore = defineStore("users", {
  state: () => {
    return {
      user: null,
      users: null
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    }
  },
  actions: {
    async loadUsers({limit = 10, offset = 0, search = null}) {
      try {
        let users = await Users.load(limit, offset, search);
        if (users) {
          await users.store();
        }
        if (offset > 0) {
          if (this.users == null) {
            this.users = [];
          }
          this.users = [...this.users, ...users];
        }
        else {
          this.users = users;
        }
        return Promise.resolve(users);
      }
      catch (error) {
        return Promise.reject(error);
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
        console.error("UserStore.googleSignin", error);
        return Promise.reject(error);
      }
    },
    async userLogin({email, password}) {
      try {
        console.log("UserStore.userLogin", email, password);
        let user = await User.login(email, password);
        if (user) {
          await user.store();
        }
        this.user = user;
        return Promise.resolve(user);
      }
      catch (error) {
        console.error("UserStore.userLogin", error);
        return Promise.reject(error);
      }
    },
    async userSignup({name, email, password}) {
      try {
        console.log("UserStore.userSignup", name, email, password);
        let user = await User.signup(email, password, name);
        if (user) {
          user.name = name;
          user = await user.save();
          user = await user.store();
        }
        this.user = user;
        return Promise.resolve(user);
      }
      catch (error) {
        console.error("UserStore.userSignup", error);
        return Promise.reject(error);
      }
    },
    async userLogout() {
      try {
        await User.logout();
        this.user = null;
        return Promise.resolve();
      }
      catch (error) {
        console.error("UserStore.userLogout", error);
        return Promise.reject(error);
      }
    },
    async resetPassword({email}) {
      try {
        await User.resetPassword(email);
        return Promise.resolve();
      }
      catch (error) {
        console.error("UserStore.resetPassword", error);
        return Promise.reject(error);
      }
    }
  }
});
