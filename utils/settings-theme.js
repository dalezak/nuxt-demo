export default async function (theme = "default", dark = false) {
  if (process.client) {
    console.log('settingsTheme', theme, dark);
    if (dark) {
      document.body.classList.add('dark');
    }
    else {
      document.body.classList.remove('dark');
    }
  }
}