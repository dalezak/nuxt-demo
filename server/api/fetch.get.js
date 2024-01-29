export default defineEventHandler(async (event) => {
  console.log('fetch.get.js', getRequestURL(event));
  const url = getRouterParam(event, 'url');
  const query = getQuery(event);
  const params = getRouterParams(event);
  return {
    url: url,
    query: query,
    params: params
  }
})