export default function (path, push = true) {
  if (process.client) {
    const router = useRouter();
    if (push) {
      router.push({ path: path });
    }
    else {
      router.replace({ path: path });
    }
  }
}