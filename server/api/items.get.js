import { faker } from "@faker-js/faker";
export default defineEventHandler(async (event) => {
  consoleLog('fetch.get.js', getRequestURL(event));
  const query = getQuery(event);
  const limit = parseInt(query.limit || 12);
  const offset = parseInt(query.offset || 0);
  await new Promise(resolve => setTimeout(resolve, 800));
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