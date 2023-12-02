<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
settingsTheme("default", false)
if (process.client) {
  // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // settingsTheme("default", prefersDark.matches)

  // settingsTheme("default", false)

  // Listen for changes to the prefers-color-scheme media query
  // prefersDark.addEventListener('change', (mediaQuery) => settingsTheme(mediaQuery.matches));

  // const viewport = useViewport()
  // watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
  //   console.log('Breakpoint:', oldBreakpoint, '->', newBreakpoint)
  // })
}
</script>