$(() => {
    'use strict';
    const path = '../resources/';
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
            return;
        }
        $('#startup')[0].play();
        $('#password').val('');
        $LOGON.hide();
        $WINDOW.show();
    });

    // BATTERY
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

    // NETWORK
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

    let calendar = new Calendar;
    let updateTime = () => {
        let {h,m,s,D,M,Y} = calendar.getDateTime();
        $('#time').text(`${h}:${m}`);
        $('#date').text(`${D}/${M}/${Y}`);
        $("#hour").text(`${h}:${m}:${s}`);
        $("#clock > #handH").css("transform", `rotate(${h * 30}deg) translate(50%)`); // 360deg / 12
        $("#clock > #handM").css("transform", `rotate(${m * 6}deg) translate(50%)`); // 360deg / 60
        $("#clock > #handS").css("transform", `rotate(${s * 6}deg) translate(50%, 25%)`);
    };
    updateTime();

    // print calendar
    let navCalendar = e => {
        let {d,D,M,Y,_M,_Y,month, _month,start,end} = calendar.navigate(e);
        $("#today").text(d + ", " + month + " " + D + ", " + Y);
        $("#curr").text(_month + " " + _Y);
        $("#days").empty();
        for (var i = 0, j = 0; i < 42; i++) {
            if (i >= start) j++;
            $("<li>", {
                class: j === D && _M === M && _Y === Y ? "active" : "",
                html: i < start || i >= start + end ? "&nbsp;" : j,
                appendTo: "#days"
            });
        }
    }
    navCalendar();
    $("#prev").click(navCalendar);
    $("#next").click(navCalendar);
    $("#today").click(navCalendar);

    // update per second
    setInterval(() => {
        updateTime();
        updateBattery();
        updateNetwork();
    }, 1000);

    // WINDOW BEHAVIORS
    Windows.prototype.windows = $WINDOWS;
    let window = new Windows;
    $(document)
        .on('click', '[data-toggle=window]', window.open)
        .on('click', '[data-toggle=expand]', e => $(e.target.dataset.target).toggle())
        .on('click', '.closewin', window.close)
        .on('click', '.maximize', window.maximize)
        .on('click', '.minimize', window.minimize)
        .on('click', '#show-desktop', window.toggleAll)
        .on('click', '.window', window.focus)
        .on('ontop', '.window', window.focus);

    Calculator.prototype = {
        result: $('#result'),
        operation: $('#operation'),
        numbers: $('.btn-num'),
        functions: $('.btn-fnc')
    };
    new Calculator;

    SnippingTool.prototype = {
        result: $('#snip-result'),
        window: $('#window-snipping'),
        screen: $('#windows'),
        start: $('.snip-start'),
        save: $('#snip-save'),
        cancel: $('#snip-cancel')
    };
    new SnippingTool;

    Browser.prototype = {
        isEnter: isEnter,
        address: $('#webaddr'),
        page: $('#webpage'),
        bing: $('#bing'),
        start: $('[data-target="#window-ie"]')
    };
    new Browser;

    Notepad.prototype = {
        editor: $('#notepad-editor'),
        new: $('#notepad-new'),
        cut: $('#notepad-cut'),
        all: $('#notepad-all'),
        undo: $('#notepad-undo'),
        copy: $('#notepad-copy'),
        wrap: $('#notepad-wrap'),
        font: $('#notepad-font'),
        delete: $('#notepad-del'),
        datetime: $('#notepad-datetime')
    };
    new Notepad;

    // START MENU
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

    // TASKBAR POPUP
    $('[data-toggle="popup"').click(function (e) {
        let $target = $('#popup-' + this.id);
        e.stopPropagation();
        if ($target.is(':visible'))
            $target.hide();
        else {
            $('.taskbar-popup').hide();
            $target.show();
        }
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
    $('#new-folder').click(() => {
        Window.prototype.desktop = $DESKTOP;
        let window = new Window;
        let $input = $('<input>')
            .val('New folder')
            .focus(e => e.target.select())
            .blur(window.create)
            .keyup(e => { if (isEnter(e)) window.create(e) });
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

            $('#startup')[0].src = /basic-2|basic-3|basic-4/.test(this.id)
                ? path + 'sound/Windows7-startup-sound-classic.ogg'
                : path + 'sound/Windows7-startup-sound.ogg';
            $wait.hide();
        }, Math.random() * 2000);
    });

    /***** MY COMPUTER *****/

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