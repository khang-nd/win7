/* eslint-disable no-alert */
const { Android } = window;
export default {
  isOnline: () => (Android ? Android.isOnline() : navigator.onLine),
  getBattery: () => {
    let promise = navigator.getBattery();
    if (Android) promise = new Promise((res) => res(Android.getBattery()));
    return promise;
  },
  showToast: (msg, dur = 1) => ((Android) ? Android.showToast(msg, dur) : alert(msg)),
  saveTextFile(folder, fileName, fileText) {
    if (Android) {
      const result = Android.saveFile(folder, fileName, fileText);
      this.showToast(result ? 'File saved' : 'Error saving file!', 0);
    } else {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = `data:application/txt,${fileText}`;
      link.click();
    }
  },
};
