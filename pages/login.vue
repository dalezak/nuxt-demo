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
                <ion-card-title v-if="isSignup">Welcome</ion-card-title>
                <ion-card-title v-else-if="isLogin">Welcome back</ion-card-title>
                <ion-card-title v-else-if="isReset">Reset password</ion-card-title>
              </ion-card-header>
              <ion-item lines="inset" v-if="isSignup">
                <ion-label position="floating">Name</ion-label>
                <ion-input aria-label="Name" ref="nameInput" v-model="name" type="text" :required="isSignup" v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset" v-if="isSignup || isLogin || isReset">
                <ion-label position="floating">Email</ion-label>
                <ion-input aria-label="Email" ref="emailInput" v-model="email" type="text" required v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-item lines="inset" v-if="isSignup || isLogin">
                <ion-label position="floating">Password</ion-label>
                <ion-input aria-label="Password" ref="passwordInput" v-model="password" type="password" required v-on:keyup.enter="onEnter"></ion-input>
              </ion-item>
              <ion-card-content>
                <ion-row>
                  <ion-col class="ion-no-padding ion-text-end">
                    <ion-button fill="solid" @click="doSignup" v-if="isSignup">Signup</ion-button>
                    <ion-button fill="solid" @click="doLogin" v-else-if="isLogin">Login</ion-button>
                    <ion-button fill="solid" @click="doReset" v-else-if="isReset">Email Instructions</ion-button>
                  </ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
            <ion-card class="ion-margin">
              <ion-card-content>
                <ion-button fill="clear" @click="loginForm" v-if="isSignup">Already have an account?</ion-button>
                <ion-button fill="clear" @click="loginForm" v-if="isReset">Back to login form?</ion-button>
                <ion-button fill="clear" @click="signupForm" v-if="isLogin">Don't have an account yet?</ion-button>
                <ion-button fill="clear" @click="resetForm" v-if="isLogin">Forgot your password?</ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

let name = $ref("");
let nameInput = $ref("");

let email = $ref("");
let emailInput = $ref("");

let password = $ref("");
let passwordInput = $ref("");

let form = $ref("login");

let isLogin = $computed(() => form == "login");
let isSignup = $computed(() => form == "signup");
let isReset = $computed(() => form == "reset");

const userStore = useUserStore();
const { userLogin, userSignup, resetPassword } = userStore;
  
function loginForm() {
  form = "login";
}

function signupForm() {
  form = "signup";
}

function resetForm() {
  form = "reset";
}

function hasName() {
  if (name.length == 0) {
    showToast("Please enter your name");
    setFocus(nameInput);
    return false;
  }
  return true;
}

function hasEmail() {
  if (email.length == 0) {
    showToast("Please enter your email");
    setFocus(emailInput);
    return false;
  }
  return true;
}

function hasPassword() {
  if (password.length == 0) {
    showToast("Please enter your password");
    setFocus(passwordInput);
    return false;
  }
  return true;
}

function onEnter() {
  if (isSignup && hasName() && hasEmail() && hasPassword()) {
    doSignup();
  }
  else if (isLogin && hasEmail() && hasPassword()) {
    doLogin();
  }
  else if (isReset && hasEmail()) {
    doReset();
  }
}

async function doLogin() {
  if (hasEmail() && hasPassword()) {
    try {
      showLoading("Logging in...");
      let user = await userLogin({
        email: email, 
        password: password
      });
      if (user) {
        showToast("Welcome back friend");
        showPageHome();
      }
      else {
        showAlert("Problem Logging In", "Please enter your credentials and try again.");
      }
    }
    catch (error) {
      console.error("doLogin", error);
      showAlert("Problem Logging In", error);
    }
    finally {
      hideLoading();
    }
  }
}

async function doSignup() {
  if (hasName() && hasEmail() && hasPassword()) {
    try {
      showLoading("Signing up...");
      let user = await userSignup({
        name: name,
        email: email,
        password: password
      });
      if (user) {
        showToast("Welcome friend");
        showPageHome();
      }
      else {
        showAlert("Problem Signing In", "Please enter your information and try again.");
      }
    }
    catch (error) {
      console.error("doSignup", error);
      showAlert("Problem Signing Up", error);
    }
    finally {
      hideLoading();
    }
  }
}

async function doReset() {
  if (hasEmail()) {
    try {
      await resetPassword({
        email: email
      });
      showAlert("Password Reset", "Please check your email for instructions to reset your password.");
    }
    catch (error) {
      console.error("doReset", error);
      showAlert("Problem Resetting Password", error);
    }
    finally {
      hideLoading();
    }
  }
}

</script>

<style scoped>
</style>
