import { useUsersStore } from "@/stores/users";
export default defineNuxtRouteMiddleware(async(to, from) => {
  const usersStore = useUsersStore();
  const user = await usersStore.userRestore();
  console.log(`auth ${from.path} >> ${to.path}`, user);
  if (to.path == '/') {
    return;
  }
  else if (to.path == '/login') {
    if (user && user.email) {
      return navigateTo('/');
    }
    else {
      return
    }
  }
  else if (to.path == '/logout') {
    return;
  }
  else if (user && user.email) {
    return;
  }
  else {
    return navigateTo('/login');
  }
});