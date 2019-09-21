$(() => {
    'use strict';

    const isEnter = e => e.key === 'Enter' || e.which === 13;
    const $WINDOW = $('#windows');
    const $WINDOWS = $('.window');
    const $LOGON = $('#logon');
    const $TOPMENU = $('#desktop-menu');
    const $SUBMENU = $('#sub-menu');
    const $DESKTOP = $('#desktop');
    const $STARTMENU = $('#start-menu');
    const $STARTBTTN = $('#start-button');
    
    $.fn.flex = function () { // custom jQuery function
        return this.css('display', 'flex'); // return to allow chaining
    };

    $LOGON.hide();
    $WINDOW.show();

    /***** LOGON *****/
    $('#password').keyup(e => {
        if (isEnter(e)) $('#start').click()
    });
    $('#start').click(e => {
        if ($('#password').val() !== 'khangnd') {
            alert('Enter my name in lowercase to access.\nSome effort will make the result more enjoyable 😉');
            return;
        }
        alert('Click About in Start Menu to view info and functional features.\nFollow me for more updates.');
        $('#startup')[0].play();
        $('#password').val('');
        $LOGON.hide();
        $WINDOW.show();
    });


    /***** TASKBAR *****/

    // battery
    var updateBattery = () => {
        if (!navigator.getBattery) return;
        navigator.getBattery().then(battery => {
            const percent = battery.level * 100;
            $('#gauge')
                .height(percent + '%')
                .css('top', 100 - percent + '%');
            $('#battery-3d > .gauge')
                .height(percent + '%')
                .css('top', 100 - percent + '%');
            $('#battery-text').text(percent + '% remaining');
        });
    };

    // network
    var updateNetwork = () => {
        if (navigator.onLine) {
            $('#network > span').css({
                'background': '#fff',
                'box-shadow': '0 0 0 1px #888'
            });
        } else {
            $('#network > span').css({
                'background': '#999',
                'box-shadow': '0 0 0 1px #555'
            });
        }
    };

    var calendar = new Calendar();
    
    // create clock marks
    for (var i = 0; i < 60; i++) {
        $("<div>", {
            class: "mark" + (i % 5 === 0 ? " h" : ""),
            appendTo: "#clock",
            css: {
                transform: `rotate(${i * 6}deg) translateX(-50%)`
            }
        });
    }

    // update per second
    setInterval(() => {
        calendar.updateTime();
        updateBattery();
        updateNetwork();
    }, 1000);

    // start menu
    $STARTBTTN.click(e => {
        e.stopPropagation();
        $(e.target).toggleClass('active');
        $STARTMENU.css('display', $STARTMENU.css('display') === 'flex' ? '' : 'flex');
    });
    $('body').click(e => {
        if ($(e.target).parents('#start-menu').length) return;
        $STARTMENU.css('display', '');
        $STARTBTTN.removeClass('active');
    });
    $('#logoff').click(e => {
        $LOGON.show();
        $WINDOW.hide();
    });

    // Popup
    $('[data-toggle="popup"').click(function (e) {
        e.stopPropagation();
        $('.taskbar-popup').hide();
        $('#popup-' + this.id).show();
    });
    $('body').click(e => {
        if ($(e.target).parents('.taskbar-popup').length) return;
        $('.taskbar-popup').hide();
    });
    $('[name="power-plan"]').click(e => {
        $WINDOW.css('filter', e.target.id === 'power-saver' ? 'brightness(0.8)' : '');
    });
    $('#power-bright').change(e => {
        $WINDOW.css('filter', `brightness(${ e.target.value })`);
    });

    /***** WINDOWS *****/

    // show desktop
    $('#show-desktop').click(() => {
        var $items = $('.taskbar-item.left');
        if (!$items.length) return; // check opened items
        $items.each((i, item) => $(item.dataset.target).toggle());
    });

    // open
    var openw = e => {
        var $target = $(e.target.dataset.target);
        $target.trigger('ontop');

        // window is already opened
        if ($('[data-id=' + $target.attr('id') + ']').length) {
            if (!$target.is(':visible')) $target.flex();
            return;
        }

        $target.flex();

        if ($target.hasClass('window-child')) return;

        // display icon in taskbar
        var icon = $target.attr('id').split('-')[1];
        $('<div>', {
            'class': 'taskbar-item left minimize ' + icon,
            'data-target': '#' + $target.attr('id'),
            'data-id': $target.attr('id'),
            'appendTo': '#taskbar'
        });
    };
    $(document).on('click', '[data-toggle=window]', openw);
    $('[data-toggle=window]').click(openw);

    // close
    $(document).on('click', '.closewin', e => {
        var $target = $(e.target.dataset.target),
            $child = $($target.data('child'));
        $target.hide();
        $child.hide();
        $('[data-id=' + $target.attr('id') + ']').remove();
    });

    // maximize
    $(document).on('click', '.maximize', e => $(e.target.dataset.target).toggleClass('maximized'));

    // minimize
    $(document).on('click', '.minimize', e => {
        var $target = $(e.target.dataset.target);
        if ($target.hasClass('focused'))
            $target.toggle();
        else {
            if (!$target.is(':visible'))
                $target.toggle();
            $WINDOWS.removeClass('focused');
            $target.addClass('focused');
        }
    });

    // focus
    var focus = e => {
        var $target = $(e.target).hasClass('window') ?
            $(e.target) :
            $(e.target).parents('.window');
        if ($target.hasClass('focused')) return;
        $WINDOWS.removeClass('focused');
        $target.addClass('focused');
    };
    $(document)
        .on('click', '.window', focus)
        .on('ontop', '.window', focus);

    // move
    $WINDOWS.draggable({
        containment: 'parent',
        handle: '.title'
    });

    /***** DESKTOP *****/

    // toggle menu
    $DESKTOP
        .on('click', e => {
            // if current target is not desktop menu -> hide
            if ($(e.target).parents('#desktop-menu').attr('id') !== 'desktop-menu' &&
                $TOPMENU.is(':visible'))
                $TOPMENU.hide();
        })
        .on('contextmenu', e => {
            if (e.target.id !== 'desktop' &&
                e.target.className.indexOf('icons') < 0) return;

            e.preventDefault();

            var x = e.offsetX || e.touches[0].clientX - $(e.target).offset().left;
            var y = e.offsetY || e.touches[0].clientY - $(e.target).offset().top;
            var w = $TOPMENU.outerWidth();
            var h = $TOPMENU.outerHeight();
            var dw = $DESKTOP.width();
            var dh = $DESKTOP.height();
            $TOPMENU.show()
                .css({
                    left: x + w < dw ? x : x - w,
                    top: y + h < dh ? y : y - h
                });
            if (x + w + $SUBMENU.width() > dw)
                $SUBMENU.css({
                    left: 'initial',
                    right: '100%'
                });
            else
                $SUBMENU.css({
                    left: '98%',
                    right: ''
                });
        });

    //  hide icons
    $('.menu-item:not(.has-sub)').click(() => $TOPMENU.hide());
    $('.ico-hide').click(e => {
        $('.icon').toggle();
        $(e.target).toggleClass('active');
    });

    // resize icons
    $('.ico-size').click(e => {
        var $target = $(e.target);
        $('#desktop-icons').attr('class', 'icons-' + $target.data('size'));
        $('.ico-size').removeClass('active');
        $target.addClass('active');
    });

    // refresh
    var refresh = val => $('.icon').css('opacity', val);
    $('#refresh').click(() => {
        refresh(0);
        setTimeout(() => refresh(1), 100);
    });

    // new folder
    var count = 0;

    function Window(title, controls, components) {
        this.makeCtrl = function (controls) {
            var _controls = [];
            controls.forEach(control => {
                _controls.push($('<div>', {
                    'class': 'control ' + control,
                    'data-target': '#window-folder-' + count,
                    'text': control === 'maximize' ? '□' : control === 'minimize' ? '–' : '×'
                }));
            });
            return _controls;
        }
        this.titlebar = $('<div>', {
            'class': 'titlebar'
        });
        this.addrbar = $('<div>', {
            'class': 'addrbar'
        });
        this.toolbar = $('<div>', {
            'class': 'toolbar'
        });
        this.content = $('<div>', {
            'class': 'container'
        });
        this.title = $('<div>', {
            'class': 'title folder'
        });
        this.controls = $('<div>', {
            'class': 'controls'
        });
        this.controls
            .append(this.makeCtrl(controls))
            .appendTo(this.titlebar);
        this.title
            .text(title)
            .appendTo(this.titlebar);
        this.addrbar
            .append([
                $('<div>').append([
                    $('<div class="button round back">&#x279C;</div>'),
                    $('<div class="button round">&#x279C;</div>')
                ]),
                $('<div>', {
                    'class': 'addr folder',
                    append: $('<label>', {
                        text: title
                    })
                }),
                $('<div>', {
                    'class': 'input',
                    append: $('<input>', {
                        type: 'search',
                        placeholder: 'Search ' + title
                    })
                })
            ]);
        this.content.append('<div class="text-center text-muted">This folder is empty.</div>');
        var _window = $('<div>', {
            'class': 'window',
            id: 'window-folder-' + count++
        });
        _window.append(this.titlebar);
        components.forEach(component => {
            _window.append(this[component]);
        });
        return _window
            .appendTo($DESKTOP)
            .draggable({
                containment: 'parent',
                handle: '.title'
            });
    }

    var rename = target => {
        $(target)
            .parents('.folder')
            .attr('data-target', '#window-folder-' + count);
        $(target).parent().text(target.value);
        $(target).remove();
        new Window(target.value,
            ['minimize', 'maximize', 'closewin'],
            ['addrbar', 'toolbar', 'content']
        );
    };
    $('#new-folder').click(() => {
        let $input = $('<input>')
            .val('New folder')
            .focus(e => e.target.select())
            .blur(e => rename(e.target))
            .keyup(e => {
                if (isEnter(e)) rename(e.target)
            });
        $('<div>', {
            'class': 'icon folder',
            'data-toggle': 'window',
            appendTo: $('#desktop-icons'),
            append: $('<label>', {
                append: $input
            })
        });
        $input.focus();
    });

    /***** IE *****/
    // cannot print iframe url to addr bar due to cross-domain policy
    var $addr = $('#webaddr'),
        $page = $('#webpage'),
        $bing = $('#bing');
    $('[data-target="#window-ie"]').click(() => {
        if (!$page[0].src)
            $page[0].src = 'https://www.sololearn.com/Profile/14575559';
    })
    $addr.focus(e => e.target.select());
    $addr.keyup(e => {
        if (isEnter(e)) $page[0].src = e.target.value;
    });
    $bing.keyup(e => {
        if (isEnter(e)) $page[0].src = 'https://www.bing.com/search?q=' + e.target.value;
    });

    /***** NOTEPAD *****/
    var $editor = $('#notepad-editor'),
        start, end; // cursor position

    // file
    $('#notepad-new').click(() => $editor.val(''));

    // edit
    var copy = () => document.execCommand('copy');
    var del = () => document.execCommand('delete');
    var cut = () => document.execCommand('cut');
    $('#notepad-undo').click(() => document.execCommand('undo'));
    $('#notepad-all').click(() => $editor.select());
    $('#notepad-datetime').click(() => document.execCommand('insertText', false, time + ' ' + date));
    $editor.blur(e => {
        start = e.target.selectionStart;
        end = e.target.selectionEnd;
        if (end === start) {
            $('#notepad-cut').addClass('text-muted').off('click');
            $('#notepad-copy').addClass('text-muted').off('click');
            $('#notepad-del').addClass('text-muted').off('click');
        } else {
            $('#notepad-cut').removeClass('text-muted').on('click', cut);
            $('#notepad-copy').removeClass('text-muted').on('click', copy);
            $('#notepad-del').removeClass('text-muted').on('click', del);
        }
    });

    // format
    $('#notepad-wrap').click(e => {
        $editor.toggleClass('wrap');
        $(e.target).toggleClass('active');
    });
    $('#notepad-font').click(e => {
        $editor.css({
            'font-family': $('input[name="font-family"]:checked').val(),
            'font-style': $('input[name="font-style"]:checked').val().split(',')[0],
            'font-weight': $('input[name="font-style"]:checked').val().split(',')[1],
            'font-size': $('input[name="font-size"]:checked').val() + 'pt'
        });
    });

    /***** PERSONALIZE *****/
    $('.theme').click(function () {
        var $body = $('#windows-container');
        if ($body.hasClass(this.id)) return;

        var $wait = $('#window-wait');
        $wait.show();
        $body.addClass('grayout');
        setTimeout(() => {
            $body.attr('class', this.id);
            $('#theme-name').text(this.innerText);
            $('.theme').removeClass('selected');
            $(this).addClass('selected');

            if (/basic-2|basic-3|basic-4/.test(this.id))
                $('#startup')[0].src = 'https://vignette.wikia.nocookie.net/khangnd/images/2/2c/Windows7-startup-sound-classic.ogv';
            else
                $('#startup')[0].src = 'https://vignette.wikia.nocookie.net/khangnd/images/5/58/Windows7-startup-sound.ogg';
            $wait.hide();
        }, Math.random() * 2000);
    });

    /***** MY COMPUTER *****/

    // expand
    $('[data-toggle=expand]').click(e => $(e.target.dataset.target).toggle());

    // disk space
    function Disk(selector, values) {
        var max = values.max - Math.random() * values.max / 50, // simulate system restore points
            cur = values.cur;
        $(selector + ' > .storage-bar').progressbar({
            value: cur,
            max: max
        });
        $(selector + ' > .storage-txt').text(
            (max - cur).toFixed(1) +
            ' GB free of ' +
            max.toFixed(1) + ' GB'
        );

        if ((max - cur) / max * 100 <= 10) $(selector + ' > .storage-bar').addClass('red-bar');
    };

    Disk('#disk-C', {
        cur: 44,
        max: 150
    })
    Disk('#disk-D', {
        cur: 140,
        max: 150
    })
    Disk('#disk-E', {
        cur: 100,
        max: 200
    })
    Disk('#disk-G', {
        cur: 2,
        max: 8
    })
});