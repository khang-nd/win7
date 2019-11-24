/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable no-undef */
const html2canvas = require('html2canvas');

module.exports = function (elements) {
  const $result = elements.result;
  const $window = elements.window;
  const $screen = elements.screen;
  const $start = elements.start;
  const $save = elements.save;
  const $cancel = elements.cancel;
  const options = {
    allowTaint: true,
    imageTimeout: 0,
  };
  const show = (snip) => {
    $window
      .show()
      .addClass('maximized');
    $result
      .removeClass('direction')
      .html(snip);
  };

  const snipRect = () => {
    let x; let y; let x1; let y1; let
      rect;

    // create a canvas as an overlay
    const canv = $('<canvas>', {
      appendTo: $screen,
      attr: {
        width: $screen.width(),
        height: $screen.height(),
      },
      css: {
        'z-index': 3,
        position: 'absolute',
        cursor: 'crosshair',
      },
    });
    const ctx = canv[0].getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(0, 0, canv[0].width, canv[0].height);

    // event handlers
    $screen.on('mousedown touchstart', function (e) {
      // get start offsets
      x = e.type === 'mousedown' ? e.offsetX : e.touches[0].clientX;
      y = e.type === 'mousedown' ? e.offsetY : e.touches[0].clientY;
      x -= $(e.target).offset().left;
      y -= $(e.target).offset().top;

      $(this).on('mousemove touchmove', (e) => {
        // get end offsets
        x1 = e.type === 'mousemove' ? e.offsetX : e.touches[0].clientX;
        y1 = e.type === 'mousemove' ? e.offsetY : e.touches[0].clientY;
        x1 -= $(e.target).offset().left;
        y1 -= $(e.target).offset().top;

        rect = {
          x: x1 > x ? x : x1,
          y: y1 > y ? y : y1,
          width: Math.abs(x1 - x),
          height: Math.abs(y1 - y),
        };

        // highlight rect
        ctx.clearRect(0, 0, canv[0].width, canv[0].height);
        ctx.fillRect(0, 0, canv[0].width, canv[0].height);
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
      });

      $(this).on('mouseup touchend', function () {
        // get snip and unbind events
        html2canvas($screen[0], $.extend(rect, options)).then(show);
        canv.remove();
        $(this)
          .off('mousedown mouseup mousemove')
          .off('touchstart touchmove touchend');
      });
    });
  };

  $start.click((e) => {
    $window.hide();
    $save.show();
    switch (e.target.id) {
      case 'snip-rect':
        snipRect();
        break;
      case 'snip-win':
        break;
      default:
        html2canvas($screen[0], options).then(show);
    }
  });

  $cancel.click(() => {
    $save.hide();
    $window.removeClass('maximized');
    $result
      .addClass('direction')
      .html('Select snip mode to start snipping.');
  });

  $save.click((e) => {
    const image = $result.children().first();
    e.target.href = image[0].toDataURL('image/png');
    e.target.download = 'capture.png';
  });
};
