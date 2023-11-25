export default defineNuxtRouteMiddleware(async(to, from) => {
  const isAuthenticated = useAuthenticated();
  console.log(`auth from ${from.path} to ${to.path}`, isAuthenticated);
  if (to.path == '/') {
    return;
  }
  else if (to.path == '/login') {
    if (isAuthenticated) {
      return navigateTo('/');
    }
    else {
      return;
    }
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (isAuthenticated) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});