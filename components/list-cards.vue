<template>
  <div class="list-cards ion-margin-vertical">
    <div>
      <slot></slot>
    </div>
    <transition name="fade" mode="out-in">
      <ion-button :disabled="loading" color="primary" expand="block" fill="outline" class="ion-margin" @click="onMore" v-if="limit > 0 && count==limit">
        <span v-if="loading">Loading...</span>
        <span v-else>Load More</span>
      </ion-button>
    </transition>
    <transition appear name="fade" mode="out-in">
      <ion-card class="ion-margin" v-if="loading == false && count == 0 && limit > 0">
        <ion-item>
          <ion-label class="ion-text-wrap">
            <p class="ion-padding-bottom ion-padding-horizontal">
              <span v-if="search && search.length > 0">There are no {{label}} matching "{{search}}".</span>
              <span v-else>It doesn't look like there are any {{label}} yet.</span>
            </p>
          </ion-label>
        </ion-item>
      </ion-card>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  limit: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: "items"
  },
  search: {
    type: String,
    default: ""
  }
})

const emit = defineEmits([
  "more"
])

function onMore(event) {
  event.stopPropagation();
  emit('more');
}
</script>

<style scoped lang="scss">

</style>