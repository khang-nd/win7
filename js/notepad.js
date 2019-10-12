var Notepad = function () {
    var EDITOR = this.editor,
        NEW = this.new,
        ALL = this.all,
        CUT = this.cut,
        UNDO = this.undo,
        COPY = this.copy,
        WRAP = this.wrap,
        FONT = this.font,
        DELETE = this.delete,
        DATETIME = this.datetime,
        start, end; // cursor position

    // file
    NEW.click(() => EDITOR.val(''));

    // edit
    var copy = () => document.execCommand('copy');
    var del = () => document.execCommand('delete');
    var cut = () => document.execCommand('cut');
    
    UNDO.click(() => document.execCommand('undo'));
    ALL.click(() => EDITOR.select());
    DATETIME.click(() => {
        var {h,m,D,M,Y} = new Calendar().getDateTime();
        document.execCommand('insertText', false, `${h}:${m} ${D}/${M}/${Y}`);
    });
    EDITOR.blur(e => {
        start = e.target.selectionStart;
        end = e.target.selectionEnd;
        if (end === start) {
            CUT.addClass('text-muted').off('click');
            COPY.addClass('text-muted').off('click');
            DELETE.addClass('text-muted').off('click');
        } else {
            CUT.removeClass('text-muted').on('click', cut);
            COPY.removeClass('text-muted').on('click', copy);
            DELETE.removeClass('text-muted').on('click', del);
        }
    });

    // format
    WRAP.click(e => {
        EDITOR.toggleClass('wrap');
        $(e.target).toggleClass('active');
    });
    FONT.click(e => {
        EDITOR.css({
            'font-family': $('input[name="font-family"]:checked').val(),
            'font-style': $('input[name="font-style"]:checked').val().split(',')[0],
            'font-weight': $('input[name="font-style"]:checked').val().split(',')[1],
            'font-size': $('input[name="font-size"]:checked').val() + 'pt'
        });
    });
};