export function useCurrentUser() {
  const user = useSupabaseUser();
  return user && user.value ? user.value : null;
}
