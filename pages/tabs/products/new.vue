<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button @click="hideModal">
            <ion-icon color="secondary" slot="icon-only" :icon="ioniconsClose"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Add Product</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-textarea label="Title" label-placement="floating" ref="titleInput" v-model="title" type="text" :auto-grow="true" required v-on:keyup.enter="onEnter"></ion-textarea>
        </ion-item>
        <ion-item>
          <ion-textarea label="Description" label-placement="floating" ref="descriptionInput" v-model="description" type="text" :auto-grow="true" required v-on:keyup.enter="onEnter"></ion-textarea>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button color="primary" @click="addProduct">Save</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

let title = $ref("");
let titleInput = $ref(null);

let description = $ref("");
let descriptionInput = $ref(null);

const productStore = useProductStore();
const { saveProduct } = productStore;

function hasTitle() {
  return hasInput(titleInput, title, "Please enter a title");
}

function hasDescription() {
  return hasInput(descriptionInput, description, "Please enter a description");
}

function onEnter() {
  if (hasTitle() && hasDescription()) {
    addProduct();
  }
}

async function addProduct() {
  if (hasTitle() && hasDescription()) {
    try {
      showLoading("Saving product...");
      let product = await saveProduct({
        title: title, 
        description: description
      });
      if (product) {
        showToast("Product has been saved");
        hideModal();
      }
      else {
        showAlert("Problem Saving Product", "An unknown problem occurred while saving the product.");
      }
    }
    catch (error) {
      consoleError("addProduct", error);
      showAlert("Problem Saving Product", error);
    }
    finally {
      hideLoading();
    }
  }
}
</script>

<style scoped>

</style>
