export default async function (object, method) {
  return object != null && typeof object[method] == "function";
}