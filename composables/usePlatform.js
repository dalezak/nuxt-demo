// import { isPlatform } from '@ionic/vue';
export default function () {
  const viewport = useViewport();
  const isMobile = ref(false);
  const isWeb = ref(false);
  
  // isMobile.value = isPlatform('mobile') || viewport.isLessThan('lg');
  // isWeb.value = isPlatform('desktop') || viewport.isGreaterOrEquals('lg');
  isMobile.value = viewport.isLessThan('lg');
  isWeb.value = viewport.isGreaterOrEquals('lg');

  watch(viewport.breakpoint, (newBreakpoint, oldBreakpoint) => {
    isMobile.value = viewport.isLessThan('lg');
    isWeb.value = viewport.isGreaterOrEquals('lg');
  })
  
  return { 
    isMobile,
    isWeb
  };
}