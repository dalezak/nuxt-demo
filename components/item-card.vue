<template>
  <transition appear name="fade" mode="out-in">
    <ion-card class="ion-margin-vertical" v-if="item">
      <ion-card-header>
        <ion-card-title>{{ item.name }}</ion-card-title>
        <ion-card-subtitle>{{ item.description }}</ion-card-subtitle>
      </ion-card-header>
    </ion-card>
  </transition>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>

</style>