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
          <ion-textarea type="text" label="Title" label-placement="floating" ref="state.titleInput" v-model="state.title" :auto-grow="true" required v-on:keyup.enter="onEnter"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-textarea type="text" label="Body" label-placement="floating" ref="state.bodyInput" v-model="state.body" :auto-grow="true" required v-on:keyup.enter="onEnter"></ion-textarea>
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

const { isApp, isWeb } = useAppScreen();

const state = reactive({
  title: "",
  titleInput: null,
  body: "",
  bodyInput: null
});

const usersStore = useUsersStore();
const { loadProfile } = usersStore;
const { profile } = storeToRefs(usersStore);

const postsStore = usePostsStore();
const { savePost } = postsStore;

function hasTitle() {
  return hasInput(state.titleInput, state.title, "Please enter a title");
}

function hasBody() {
  return hasInput(state.bodyInput, state.body, "Please enter a body");
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
        title: state.title, 
        body: state.body,
        user_id: profile.id
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
      showError("Problem Saving Post", error);
    }
    finally {
      hideLoading();
    }
  }
}

const loadData = async () => {
  await loadProfile();
}

if (isApp.value) {
  onMounted(async () => {
    await loadData();
  });
}
else {
  await loadData();
}
</script>

<style scoped>

</style>
