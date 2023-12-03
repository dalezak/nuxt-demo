<template>
  <transition appear name="fade" mode="out-in">
    <ion-card>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-breadcrumbs>
              <ion-breadcrumb :title="breadcrumb.label" @click="visitBreadcrumb(breadcrumb.path)" :key="breadcrumb.name" v-for="breadcrumb of breadcrumbs">{{ breadcrumb.label }}</ion-breadcrumb>
            </ion-breadcrumbs>
          </ion-col>
          <ion-col size="6" size-md="4" size-lg="3" v-if="hasSearch">
            <ion-searchbar type="search" :value="search" @ionInput="doSearch"></ion-searchbar>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>
  </transition>
</template>

<script setup>
const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  },
  search: {
    type: String,
    default: ""
  },
  onSearch: {
    type: Function
  }
});

const hasSearch = props['onSearch'] !== undefined;

function doSearch() {
  if (props.onSearch) {
    props.onSearch();
  }
}

function visitBreadcrumb(path) {
  showPage(path, false);
}
</script>

<style scoped lang="scss">
.sc-ion-searchbar-md-h {
  --box-shadow: none !important;
  border-radius: 5px !important;
  border: 1px solid var(--ion-color-light) !important;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-inline-start: 0px;
  padding-inline-end: 0px;
}
ion-breadcrumb {
  cursor: pointer;
}
</style>