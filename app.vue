<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
const { theme, dark } = useAppConfig();
settingsTheme(theme, dark);

onMounted(() => {
  consoleLog("app", "mounted", "demo");
})
</script>