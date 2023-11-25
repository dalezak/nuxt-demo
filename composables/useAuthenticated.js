export const useAuthenticated = () => {
  const user = useSupabaseUser();
  return user.value && user.value.id != null;
}
