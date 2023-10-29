import { useUsersStore } from "@/stores/users";
export default defineNuxtRouteMiddleware(async(to, _from) => {
  const usersStore = useUsersStore();
  const user = await usersStore.getUser || await usersStore.userRestore();
  if (user && user.email) {
    if (to.path == '/login') {
      return navigateTo('/');
    }
    return;
  }
  else if (to.path == '/') {
    return;
  }
  else {
    return navigateTo('/login');
  }
});