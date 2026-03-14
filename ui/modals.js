export const Modal = {
  alert(message) {
    window.alert(message);
  },

  error(message) {
    console.error(message);
    window.alert(message);
  },

  confirm(message) {
    return Promise.resolve(window.confirm(message));
  },
};
