/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */

require('./util');

const SnippingTool = require('./snipping');
const Calculator = require('./calculator');
const Browser = require('./browser');
const Notepad = require('./notepad');
const Calendar = require('./calendar');
const Window = require('./window');
const Windows = require('./windows');
const Player = require('./mediaplayer');

$(() => {
  const isEnter = (e) => e.key === 'Enter' || e.which === 13;
  const { random } = Math;
  const { href } = window.location;

  const $BOOT = $('#boot');
  const $LOGON = $('#logon');
  const $WINDOW = $('#windows');
  const $WINDOWS = $('.window');
  const $TOPMENU = $('#desktop-menu');
  const $SUBMENU = $('#sub-menu');
  const $DESKTOP = $('#desktop');
  const $STARTMENU = $('#start-menu');
  const $STARTBTTN = $('#start-button');

  // BOOT
  (function () {
    const loads = [];
    const loadImage = (src) => {
      const deferred = $.Deferred();
      $('<img>', {
        src,
        onload() { deferred.resolve(); },
        appendTo: $('#preload'),
      });
      return deferred;
    };
    const fetchData = (data) => {
      let path = '/bg';
      path = $(data).filter('title').text().indexOf(path) > -1 ? path : '/ico';
      $(data).find('a').each((_, a) => {
        if (/.(ico|png|jpe?g)/.test(a.innerText)) {
          const icon = $(a).find('.name').text() || a.innerText;
          loads.push(loadImage(`${href}resources${path}/${icon}`));
        }
      });
    };
    const loadIco = $.get(`${href}resources/ico`, fetchData);
    const loadBg = $.get(`${href}resources/bg`, fetchData);
    $.when(...loads, loadIco, loadBg).done(() => {
      setTimeout(() => {
        $BOOT.hide();
        $LOGON.show();
      }, 7500); // 7.5 secs for boot screen
    });
  }());

  // LOGON
  (function () {
    $('#password').keyup((e) => {
      if (isEnter(e)) $('#start').click();
    });
    $('#start').click(() => {
      $('#password').val('');
      $('#user').click();
    });
    $('#user').click(() => {
      $('#startup')[0].play();
      $LOGON.hide();
      $WINDOW.show();
    });
  }());

  // BATTERY
  const updateBattery = () => {
    if (!navigator.getBattery) return;
    navigator.getBattery().then((battery) => {
      const percent = battery.level * 100;
      $('#gauge')
        .height(`${percent}%`)
        .css('top', `${100 - percent}%`);
      $('#battery-3d > .gauge')
        .height(`${percent}%`)
        .css('top', `${100 - percent}%`);
      $('#battery-text').text(`${percent.toFixed(0)}% remaining`);
    });
  };

  // NETWORK
  const updateNetwork = () => {
    if (navigator.onLine) {
      $('#network > span').css({
        background: '#fff',
        'box-shadow': '0 0 0 1px #888',
      });
    } else {
      $('#network > span').css({
        background: '#999',
        'box-shadow': '0 0 0 1px #555',
      });
    }
  };

  // create clock marks
  for (let i = 0; i < 60; i += 1) {
    $('<div>', {
      class: `mark${i % 5 === 0 ? ' h' : ''}`,
      appendTo: '#clock',
      css: {
        transform: `rotate(${i * 6}deg) translateX(-50%)`,
      },
    });
  }

  const calendar = new Calendar();
  const updateTime = () => {
    const {
      h, m, s, D, M, Y,
    } = calendar.getDateTime();
    $('#time').text(`${h}:${m}`);
    $('#date').text(`${D}/${M}/${Y}`);
    $('#hour').text(`${h}:${m}:${s}`);
    $('#clock > #handH').css(
      'transform',
      `rotate(${h * 30}deg) translate(50%)`,
    ); // 360deg / 12
    $('#clock > #handM').css('transform', `rotate(${m * 6}deg) translate(50%)`); // 360deg / 60
    $('#clock > #handS').css(
      'transform',
      `rotate(${s * 6}deg) translate(50%, 25%)`,
    );
  };
  updateTime();

  // print calendar
  const navCalendar = (e) => {
    const {
      d, D, M, Y, _M, _Y, month, _month, start, end,
    } = calendar.navigate(
      e,
    );
    $('#today').text(`${d}, ${month} ${D}, ${Y}`);
    $('#curr').text(`${_month} ${_Y}`);
    $('#days').empty();
    for (let i = 0, j = 0; i < 42; i += 1) {
      if (i >= start) j += 1;
      $('<li>', {
        class: j === D && _M === M && _Y === Y ? 'active' : '',
        html: i < start || i >= start + end ? '&nbsp;' : j,
        appendTo: '#days',
      });
    }
  };
  navCalendar();
  $('#prev').click(navCalendar);
  $('#next').click(navCalendar);
  $('#today').click(navCalendar);

  // update per second
  setInterval(() => {
    updateTime();
    updateBattery();
    updateNetwork();
  }, 1000);

  // WINDOW BEHAVIORS
  const windows = new Windows($WINDOWS);
  $(document)
    .on('click', '[data-toggle=window]', windows.open)
    .on('click', '[data-toggle=expand]', (e) => $(e.target.dataset.target).toggle())
    .on('click', '.closewin', windows.close)
    .on('click', '.maximize', windows.maximize)
    .on('click', '.minimize', windows.minimize)
    .on('click', '#show-desktop', windows.toggleAll)
    .on('click', '.window', windows.focus)
    .on('ontop', '.window', windows.focus);

  Calculator({
    result: $('#result'),
    operation: $('#operation'),
    numbers: $('.btn-num'),
    functions: $('.btn-fnc'),
  });

  SnippingTool({
    result: $('#snip-result'),
    window: $('#window-snipping'),
    screen: $('#windows'),
    start: $('.snip-start'),
    save: $('#snip-save'),
    cancel: $('#snip-cancel'),
  });

  Browser({
    isEnter,
    address: $('#webaddr'),
    page: $('#webpage'),
    bing: $('#bing'),
    start: $('[data-target="#window-ie"]'),
  });

  Notepad({
    editor: $('#notepad-editor'),
    new: $('#notepad-new'),
    cut: $('#notepad-cut'),
    all: $('#notepad-all'),
    undo: $('#notepad-undo'),
    copy: $('#notepad-copy'),
    wrap: $('#notepad-wrap'),
    font: $('#notepad-font'),
    delete: $('#notepad-del'),
    datetime: $('#notepad-datetime'),
  });

  Player({
    audioBrowser: $('#player-open__audio'),
    videoBrowser: $('#player-open__video'),
    photoBrowser: $('#player-open__photo'),
    playlist: $('#player-list'),
    volume: $('#volume > input'),
    progress: $('#player-progress'),
    audio: $('#player-audio'),
    video: $('#player-video'),
    random: $('#random'),
    loop: $('#loop'),
    play: $('#play'),
    prev: $('#play-prev'),
    next: $('#play-next'),
    stop: $('#stop'),
    mute: $('#mute'),
  });

  // START MENU
  $STARTBTTN.click((e) => {
    e.stopPropagation();
    $(e.target).toggleClass('active');
    $STARTMENU.css(
      'display',
      $STARTMENU.css('display') === 'flex' ? '' : 'flex',
    );
  });
  $('body').click((e) => {
    if ($(e.target).parents('#start-menu').length) return;
    $STARTMENU.css('display', '');
    $STARTBTTN.removeClass('active');
  });
  $('#logoff').click(() => {
    $LOGON.show();
    $WINDOW.hide();
  });

  // TASKBAR POPUP
  $('[data-toggle="popup"').click(function (e) {
    const $target = $(`#popup-${this.id}`);
    e.stopPropagation();
    if ($target.is(':visible')) $target.hide();
    else {
      $('.taskbar-popup').hide();
      $target.show();
    }
  });
  $('body').click((e) => {
    if ($(e.target).parents('.taskbar-popup').length) return;
    $('.taskbar-popup').hide();
  });
  $('[name="power-plan"]').click((e) => {
    $WINDOW.css(
      'filter',
      e.target.id === 'power-saver' ? 'brightness(0.8)' : '',
    );
  });
  $('#power-bright').change((e) => {
    $WINDOW.css('filter', `brightness(${e.target.value})`);
  });

  // ========== DESKTOP ==============

  // toggle menu
  $DESKTOP
    .on('mousedown touchstart', (e) => {
      // if current target is not desktop menu -> hide
      if (
        $TOPMENU.is(':visible')
        && $(e.target)
          .parents('#desktop-menu')
          .attr('id') !== 'desktop-menu'
      ) $TOPMENU.hide();
    })
    .on('taphold contextmenu', (e) => {
      if (
        e.target.id !== 'desktop'
        && e.target.className.indexOf('icons') < 0
      ) return;

      e.preventDefault();

      const x = e.offsetX || e.touches[0].clientX - $(e.target).offset().left;
      const y = e.offsetY || e.touches[0].clientY - $(e.target).offset().top;
      const w = $TOPMENU.outerWidth();
      const h = $TOPMENU.outerHeight();
      const dw = $DESKTOP.width();
      const dh = $DESKTOP.height();
      $TOPMENU.show().css({
        left: x + w < dw ? x : x - w,
        top: y + h < dh ? y : y - h,
      });
      if (x + w + $SUBMENU.width() > dw) {
        $SUBMENU.css({
          left: 'initial',
          right: '100%',
        });
      } else {
        $SUBMENU.css({
          left: '98%',
          right: '',
        });
      }
    });

  //  hide icons
  $('.menu-item:not(.has-sub)').click(() => $TOPMENU.hide());
  $('.ico-hide').click((e) => {
    $('.icon').toggle();
    $(e.target).toggleClass('active');
  });

  // resize icons
  $('.ico-size').click((e) => {
    const $target = $(e.target);
    $('#desktop-icons').attr('class', `icons-${$target.data('size')}`);
    $('.ico-size').removeClass('active');
    $target.addClass('active');
  });

  // refresh
  const refresh = (val) => $('.icon').css('opacity', val);
  $('#refresh').click(() => {
    refresh(0);
    setTimeout(() => refresh(1), 100);
  });

  // new folder
  $('#new-folder').click(() => {
    const window = new Window($DESKTOP);
    const $input = $('<input>')
      .val('New folder')
      .focus((e) => e.target.select())
      .blur(window.create)
      .keyup((e) => {
        if (isEnter(e)) window.create(e);
      });
    $('<div>', {
      class: 'icon folder',
      'data-toggle': 'window',
      appendTo: $('#desktop-icons'),
      append: $('<label>', {
        append: $input,
      }),
    });
    $input.focus();
  });

  // ============= PERSONALIZE ====================
  $('.theme').click(function () {
    const self = this;
    const $body = $('#windows-container');
    const $wait = $('#window-wait');
    if ($body.hasClass(this.id)) return;

    function changeTheme() {
      $body.attr('class', self.id);
      $('#theme-name').text(self.innerText);
      $('.theme').removeClass('selected');
      $(self).addClass('selected');
      $('#startup')[0].src = /basic-2|basic-3|basic-4/.test(self.id)
        ? `${href}resources/sound/Windows7-startup-sound-classic.ogg`
        : `${href}resources/sound/Windows7-startup-sound.ogg`;
      $wait.hide();
    }
    $wait.show();
    $body.addClass('grayout');
    setTimeout(changeTheme, random() * 2000);
  });

  // ============= MY COMPUTER ===============

  // disk space
  function Disk(selector, values) {
    const max = values.max - (random() * values.max) / 50; // simulate system restore points
    const { cur } = values;
    $(`${selector} > .storage-bar`).progressbar({
      value: cur,
      max,
    });
    $(`${selector} > .storage-txt`).text(
      `${(max - cur).toFixed(1)} GB free of ${max.toFixed(1)} GB`,
    );

    if (((max - cur) / max) * 100 <= 10) {
      $(`${selector} > .storage-bar`).addClass('red-bar');
    }
  }

  Disk('#disk-C', {
    cur: 44,
    max: 150,
  });
  Disk('#disk-D', {
    cur: 140,
    max: 150,
  });
  Disk('#disk-E', {
    cur: 100,
    max: 200,
  });
  Disk('#disk-G', {
    cur: 2,
    max: 8,
  });
});
