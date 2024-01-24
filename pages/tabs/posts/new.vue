<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button @click="hideModal">
            <ion-icon color="secondary" slot="icon-only" :icon="ioniconsClose"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Add Post</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-textarea label="Title" label-placement="floating" ref="titleInput" v-model="title" type="text" :auto-grow="true" required v-on:keyup.enter="onEnter"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-textarea label="Body" label-placement="floating" ref="bodyInput" v-model="body" type="text" :auto-grow="true" required v-on:keyup.enter="onEnter"></ion-textarea>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color="primary" @click="addPost">Save</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const user = useCurrentUser();

let title = $ref("");
let titleInput = $ref(null);

let body = $ref("");
let bodyInput = $ref(null);

const postStore = usePostStore();
const { savePost } = postStore;

function hasTitle() {
  return hasInput(titleInput, title, "Please enter a title");
}

function hasBody() {
  return hasInput(bodyInput, body, "Please enter a body");
}

function onEnter() {
  if (hasTitle() && hasBody()) {
    addPost();
  }
}

async function addPost() {
  if (hasTitle() && hasBody()) {
    try {
      showLoading("Saving post...");
      let post = await savePost({
        title: title, 
        body: body,
        user_id: user.id
      });
      if (post) {
        showToast("Post has been saved");
        hideModal();
      }
      else {
        showAlert("Problem Saving Post", "An unknown problem occurred while saving the post.");
      }
    }
    catch (error) {
      console.error("addPost", error);
      showAlert("Problem Saving Post", error);
    }
    finally {
      hideLoading();
    }
  }
}
</script>

<style scoped>

</style>
