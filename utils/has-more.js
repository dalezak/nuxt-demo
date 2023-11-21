export default async function (items, limit) {
  if (process.client) {
    return items && items.length > 0 && (items.length >= limit && items.length % limit > 0);
  }
  return false;
}