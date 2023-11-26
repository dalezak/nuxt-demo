export function useAuthenticated() {
  const user = useSupabaseUser();
  return user && user.value;
}
