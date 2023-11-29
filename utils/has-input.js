export default function (input, value, message = "Please enter a value") {
  if (value && value.length > 0) {
    return true;
  }
  else {
    showToast(message);
    if (input) {
      setFocus(input);
    }
    return false;
  }
}