export default defineEventHandler(async (event) => {
  consoleLog('submit.post.js', getRequestURL(event));
  const url = getRouterParam(event, 'url');
  const query = getQuery(event);
  const params = getRouterParams(event);
  const body = await readBody(event);
  return { 
    url: url,
    query: query,
    params: params,
    body: body 
  }
})