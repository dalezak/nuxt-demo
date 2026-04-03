import { faker } from "@faker-js/faker";
export default defineEventHandler(async (event) => {
  console.log('fetch.get.js', getRequestURL(event));
  const query = getQuery(event);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || 12, 10)));
  const offset = Math.max(0, parseInt(query.offset || 0, 10));
  const delay = parseInt(process.env.ITEMS_DELAY_MS ?? '0', 10);
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  let items = [];
  for (let i=offset; i<limit+offset; i++) {
    items.push({
      id: i,
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      url: faker.internet.url(),
      image: faker.image.avatar(),
      tags: faker.lorem.words(3).split(' ')
    });
   }
  return items;
})