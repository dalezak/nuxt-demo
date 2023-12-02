<template>
  <ion-tabs v-if="tabs && tabs.length > 0">
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar :slot="position" v-show="visible">
      <ion-tab-button :tab="tab.name" :href="tab.path" :key="tab.name" v-for="tab of tabs">
        <ion-icon :icon="getIcon(tab.icon)" />
        <ion-label>{{ tab.label }}</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script setup>
import * as icon from 'ionicons/icons';
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  tabs: {
    type: Array,
    default: () => []
  },
  position: {
    type: String,
    default: "bottom"
  }
});
function getIcon(name) {
  return icon[name];
}
</script>

<style scoped lang="scss">

</style>