export default defineEventHandler(async (event) => {
  console.log('fetch.get.js', getRequestURL(event));
  const query = getQuery(event);
  const limit = parseInt(query.limit || 12);
  const offset = parseInt(query.offset || 0);
  console.log("query", query);
  console.log("limit", limit);
  console.log("offset", offset);
  await new Promise(resolve => setTimeout(resolve, 2000));
  let items = [];
  for (let i=offset+1; i<limit+offset+1; i++) {
    items.push({
      id: i,
      name: `Item ${i}`,
      description: `This is item ${i}`,
      url: `https://example.com/item/${i}`,
      image: `https://picsum.photos/seed/${i}/200/300`
    });
   }
  return items;
})