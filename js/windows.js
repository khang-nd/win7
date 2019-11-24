/* eslint-disable no-undef */
/* eslint-disable func-names */
module.exports = function ($windows) {
  $windows.draggable({
    containment: 'parent',
    handle: '.title',
  });

  this.open = (e) => {
    const $target = $(e.target.dataset.target);
    const id = $target.attr('id');
    $target.trigger('ontop');

    // window is already opened
    if ($(`[data-id=${id}]`).length) {
      if (!$target.is(':visible')) $target.flex();
      return;
    }

    $target.flex();

    if ($target.hasClass('window-child')) return;

    // display icon in taskbar
    const icon = id.split('-')[1];
    $('<div>', {
      class: `taskbar-item left minimize ${icon}`,
      'data-target': `#${id}`,
      'data-id': id,
      appendTo: '#taskbar',
    });
  };

  this.close = (e) => {
    const $target = $(e.target.dataset.target);
    const $child = $($target.data('child'));
    $target.hide();
    $child.hide();
    $(`[data-id=${$target.attr('id')}]`).remove();
  };

  this.maximize = (e) => $(e.target.dataset.target).toggleClass('maximized');

  this.minimize = (e) => {
    const $target = $(e.target.dataset.target);
    if ($target.hasClass('focused')) { $target.toggle(); } else {
      if (!$target.is(':visible')) { $target.toggle(); }
      $windows.removeClass('focused');
      $target.addClass('focused');
    }
  };

  this.toggleAll = (e) => {
    const $items = $('.taskbar-item.left');
    if (!$items.length) return; // check opened items
    if (e.target.dataset.action === 'show') {
      e.target.dataset.action = 'hide';
      $items.each((i, item) => $(item.dataset.target).hide());
    } else {
      e.target.dataset.action = 'show';
      $items.each((i, item) => $(item.dataset.target).show());
    }
  };

  this.focus = (e) => {
    const $target = $(e.target).hasClass('window')
      ? $(e.target)
      : $(e.target).parents('.window');
    if ($target.hasClass('focused')) return;
    $windows.removeClass('focused');
    $target.addClass('focused');
  };
};
