<template>
  <transition appear name="fade" mode="out-in">
    <div class="ion-padding-top" v-if="item">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ item.name }}</ion-card-title>
          <ion-card-subtitle>{{ item.description }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content v-if="item.tags && item.tags.length > 0">
          <ion-chip class="ion-margin-end" :key="tag" v-for="tag of item.tags">{{ tag }}</ion-chip>
        </ion-card-content>
      </ion-card>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  item: { 
    type: Object 
  }
})
</script>

<style lang="scss" scoped>

</style>