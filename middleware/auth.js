import { useUsersStore } from "@/stores/users";
export default defineNuxtRouteMiddleware(async(to, _from) => {
  console.log("route", to);
  const usersStore = useUsersStore();
  const user = await usersStore.getUser || await usersStore.userRestore();
  console.log("user", user);
  if (user == false) {
    return navigateTo('/login');
  }
  else {
    return;
  }
});