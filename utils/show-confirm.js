export default async function (title, subtitle = null, message = null, callback) {
  if (process.client) {
    showAlert(title, subtitle, message, [
      {
        text: "Cancel"
      }, {
        text: "Ok",
        handler: () => {
          if (callback) {
            callback();
          }
        }
      }
    ]);
  }
  return null;
}