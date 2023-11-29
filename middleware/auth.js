export default defineNuxtRouteMiddleware(async(to, from) => {
  const currentUser = useCurrentUser();
  console.log(`auth from ${from.path} to ${to.path}`, currentUser);
  if (to.path == '/') {
    return;
  }
  else if (to.path == '/login') {
    if (currentUser) {
      return navigateTo('/');
    }
    else {
      return;
    }
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (currentUser) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});