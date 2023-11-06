<template>
  <transition appear name="fade" mode="out-in">
    <div class="ion-padding-top" v-if="item">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ item.name }}</ion-card-title>
          <ion-card-subtitle>{{ item.description }}</ion-card-subtitle>
        </ion-card-header>
      </ion-card>
    </div>
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