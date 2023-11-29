import PostNew from '~/pages/tabs/posts/new.vue';
export default async function () {
  if (process.client) {
    return await showModal(PostNew);
  }
  return null;
}