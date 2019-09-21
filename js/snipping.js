function snipping($WINDOW) {
    
    var $snip = $('#snip-result');
    var $wind = $('#window-snipping');
    var screen = $WINDOW[0];

    var options = {
        allowTaint: true,
        imageTimeout: 0
    };
    var show = snip => {
        $wind.show()
            .addClass('maximized');
        $snip.removeClass('direction')
            .html(snip);
    };
    var snipRect = () => {
        var x, y, x1, y1, rect;

        // create a canvas as an overlay
        var canv = $('<canvas>', {
            appendTo: screen,
            attr: {
                width: $(screen).width(),
                height: $(screen).height()
            },
            css: {
                'z-index': 3,
                position: 'absolute',
                cursor: 'crosshair'
            }
        });
        var ctx = canv[0].getContext('2d');
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(0, 0, canv[0].width, canv[0].height);

        // event handlers
        $(screen).on('mousedown touchstart', function (e) {
            // get start offsets
            x = e.type === 'mousedown' ? e.offsetX : e.touches[0].clientX;
            y = e.type === 'mousedown' ? e.offsetY : e.touches[0].clientY;
            x -= $(e.target).offset().left;
            y -= $(e.target).offset().top;

            $(this).on('mousemove touchmove', function (e) {
                // get end offsets
                x1 = e.type === 'mousemove' ? e.offsetX : e.touches[0].clientX;
                y1 = e.type === 'mousemove' ? e.offsetY : e.touches[0].clientY;
                x1 -= $(e.target).offset().left;
                y1 -= $(e.target).offset().top;

                rect = {
                    x: x1 > x ? x : x1,
                    y: y1 > y ? y : y1,
                    w: Math.abs(x1 - x),
                    h: Math.abs(y1 - y)
                };

                // highlight rect
                ctx.clearRect(0, 0, canv[0].width, canv[0].height);
                ctx.fillRect(0, 0, canv[0].width, canv[0].height);
                ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
                ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
            });

            $(this).on('mouseup touchend', function (e) {
                // get snip and clear up events
                html2canvas(screen, $.extend(rect, options)).then(show);
                canv.remove();
                $(this)
                    .off('mousedown mouseup mousemove')
                    .off('touchstart touchmove touchend');
            });
        });
    };
    $('.snip').click(e => {
        switch (e.target.id) {
            case 'snip-rect':
                $wind.hide();
                snipRect();
                break;
            case 'snip-win':
                break;
            case 'snip-full':
                html2canvas(screen, options).then(show);
                break;
        }
    });
    $('#snip-cancel').click(e => {
        $wind.removeClass('maximized');
        $snip.addClass('direction')
            .html('Select snip mode to start snipping.');
    });

}