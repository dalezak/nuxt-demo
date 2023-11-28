import SharePopover from '~/components/share-popover.vue';
export default async function (event, props = {}) {
  if (process.client) {
    return await showPopover(SharePopover, event, props);
  }
  return null;
}