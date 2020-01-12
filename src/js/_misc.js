/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
const create = (elem) => document.createElement(elem);
const query = (elem) => (elem.startsWith('.')
  ? document.querySelectorAll(elem)
  : document.querySelector(elem));
export default (() => {
  window.addEventListener('load', () => {
    const style = create('style');
    style.innerHTML = `.ripple {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      position: absolute;
      transform: scale(0);
      animation: sploosh 0.6s linear;
      background: rgba(255, 255, 255, 0.5);
      opacity: 1;
      pointer-events: none;
    }
    @keyframes sploosh {
      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }`;
    query('head').append(style);
    query('body').addEventListener('touchend', function (e) {
      const dot = create('div');
      dot.className = 'ripple';
      dot.style.left = `${e.changedTouches[0].clientX - 25}px`;
      dot.style.top = `${e.changedTouches[0].clientY - 25}px`;
      this.append(dot);
      setTimeout(() => dot.remove(), 600);
    });
  });

  window.addEventListener('resize', () => {
    const windows = query('.window');
    windows.forEach((win) => {
      const { display } = win.style;
      if (display && display !== 'none') {
        win.style.top = 0;
        win.style.left = 0;
      }
    });
  });
})();
