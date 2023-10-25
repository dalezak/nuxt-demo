<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nuxt</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-grid>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" size-sm="12" size-md="10" size-lg="8" size-xl="6">
            <ion-card class="ion-margin">
              <ion-card-header>
                <ion-card-title v-if="form=='signup'">Welcome</ion-card-title>
                <ion-card-title v-else-if="form=='login'">Welcome back</ion-card-title>
                <ion-card-subtitle v-if="form=='signup'">Enter your name, email and password</ion-card-subtitle>
                <ion-card-subtitle v-else-if="form=='login'">Enter your email and password</ion-card-subtitle>
              </ion-card-header>
              <ion-item lines="inset" v-if="form=='signup'">
                <ion-label position="floating">Name</ion-label>
                <ion-input aria-label="Name" ref="name" v-model="name" type="text" required v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset" >
                <ion-label position="floating">Email</ion-label>
                <ion-input aria-label="Email" ref="email" v-model="email" type="text" required v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset">
                <ion-label position="floating">Password</ion-label>
                <ion-input aria-label="Password" ref="password" v-model="password" type="password" required v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-card-content>
                <ion-row>
                  <ion-col class="ion-no-padding ion-text-end">
                    <ion-button fill="solid" @click="doLogin" v-if="form=='login'">Login</ion-button>
                    <ion-button fill="solid" @click="doSignup" v-else-if="form=='signup'">Signup</ion-button>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
            <ion-card class="ion-margin">
              <ion-card-content>
                <ion-button fill="clear" @click="showLogin" v-if="form=='signup'">Already have an account?</ion-button>
                <ion-button fill="clear" @click="showSignup" v-if="form=='login'">Don't have an account yet?</ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';

import { mapState, mapActions } from 'pinia';

import { useUsersStore } from '@/stores/users';

import helpers from "@/mixins/helpers";

export default defineComponent({
  name: 'UserLogin',
  mixins: [
    helpers
  ],
  data() {
    return {
      form: "login",
      name: "",
      email: "",
      password: ""
    }
  },
  computed: {
    ...mapState(useUsersStore, ['user', 'getUser']),
  },
  mounted() {
  },
  methods: {
    ...mapActions(useUsersStore, ['userLogin', 'userSignup']),
    showLogin() {
      this.form = "login"
    },
    showSignup() {
      this.form = "signup"
    },
    onEnter() {
      if (this.form == "signup" && this.name.length == 0) {
        this.setFocus(this.$refs.name);
      }
      else if (this.email.length == 0) {
        this.setFocus(this.$refs.email);
      }
      else if (this.password.length == 0) {
        this.setFocus(this.$refs.password);
      }
      else if (this.form == "signup") {
        this.doSignup();
      }
      else if (this.form == "login") {
        this.doLogin();
      }
    },
    async doLogin() {
      if (this.email.length == 0) {
        this.showToast("Please enter your email");
        this.setFocus(this.$refs.email);
      }
      else if (this.password.length == 0) {
        this.showToast("Please enter your password");
        this.setFocus(this.$refs.password);
      }
      else {
        try {
          console.log("email", this.email);
          this.showLoading("Logging in...");
          let user = await this.userLogin({
            email: this.email, 
            password: this.password
          });
          console.log("userLogin", user);
          if (user) {
            this.showToast(`Welcome back ${user || "friend"}`);
            this.showHomePage();
          }
        }
        catch (error) {
          console.error("userLogin", error);
          this.showAlert("Problem Logging In", this.errorMessage(error));
        }
        finally {
          this.hideLoading();
        }
      }
    },
    async doSignup() {
      if (this.name.length == 0) {
        this.showToast("Please enter your name");
        this.setFocus(this.$refs.name);
      }
      else if (this.email.length == 0) {
        this.showToast("Please enter your email");
        this.setFocus(this.$refs.email);
      }
      else if (this.password.length == 0) {
        this.showToast("Please enter your password");
        this.setFocus(this.$refs.password);
      }
      else {
        try {
          this.showLoading("Signing up...");
          let user = await this.userSignup({
            name: this.name,
            email: this.email,
            password: this.password
          });
          console.log("userSignup", user);
          if (user) {
            this.showToast(`Welcome ${user || "friend"}`);
            this.showHomePage();
          }
        }
        catch (error) {
          console.error("userSignup", error);
          this.showAlert("Problem Signing Up", this.errorMessage(error));
        }
        finally {
          this.hideLoading();
        }
      }
    },
    errorMessage(error) {
      if (error.code) {
        let message = error.code.replace("auth/", "").replaceAll("-", " ");
        return message.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
      }
      return  "Unknown error has occured"
    }
  }
});
</script>

<style scoped>
</style>
