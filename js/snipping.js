var SnippingTool = function () {

    var $result = this.result;
    var $window = this.window;
    var $screen = this.screen;
    var $start = this.start;
    var $save = this.save;
    var $cancel = this.cancel;
    var options = {
        allowTaint: true,
        imageTimeout: 0
    };
    var show = snip => {
        $window
            .show()
            .addClass('maximized');
        $result
            .removeClass('direction')
            .html(snip);
    };

    var snipRect = () => {
        var x, y, x1, y1, rect;

        // create a canvas as an overlay
        var canv = $('<canvas>', {
            appendTo: $screen,
            attr: {
                width: $screen.width(),
                height: $screen.height()
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
        $screen.on('mousedown touchstart', function (e) {
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
                    width: Math.abs(x1 - x),
                    height: Math.abs(y1 - y)
                };

                // highlight rect
                ctx.clearRect(0, 0, canv[0].width, canv[0].height);
                ctx.fillRect(0, 0, canv[0].width, canv[0].height);
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
                ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
            });

            $(this).on('mouseup touchend', function (e) {
                // get snip and unbind events
                html2canvas($screen[0], $.extend(rect, options)).then(show);
                canv.remove();
                $(this)
                    .off('mousedown mouseup mousemove')
                    .off('touchstart touchmove touchend');
            });
        });
    };

    $start.click(e => {
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

    $save.click(e => {
        var image = $result.children().first();
        e.target.href = image[0].toDataURL('image/png');
        e.target.download = 'capture.png';
    });
}