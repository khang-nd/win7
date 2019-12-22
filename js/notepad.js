/* eslint-disable no-undef */
const Calendar = require('./calendar');

module.exports = (elements) => {
  const EDITOR = elements.editor;
  const NEW = elements.new;
  const ALL = elements.all;
  const CUT = elements.cut;
  const UNDO = elements.undo;
  const COPY = elements.copy;
  const WRAP = elements.wrap;
  const FONT = elements.font;
  const DELETE = elements.delete;
  const DATETIME = elements.datetime;

  // cursor position
  let start;
  let end;

  // file
  NEW.click(() => EDITOR.val(''));

  // edit
  const copy = () => document.execCommand('copy');
  const del = () => document.execCommand('delete');
  const cut = () => document.execCommand('cut');

  UNDO.click(() => document.execCommand('undo'));
  ALL.click(() => EDITOR.select());
  DATETIME.click(() => {
    const {
      h, m, D, M, Y,
    } = new Calendar().getDateTime();
    document.execCommand('insertText', false, `${h}:${m} ${D}/${M}/${Y}`);
  });
  EDITOR.blur((e) => {
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
  WRAP.click((e) => {
    EDITOR.toggleClass('wrap');
    $(e.target).toggleClass('active');
  });
  FONT.click(() => {
    EDITOR.css({
      'font-family': $('input[name="font-family"]:checked').val(),
      'font-style': $('input[name="font-style"]:checked').val().split(',')[0],
      'font-weight': $('input[name="font-style"]:checked').val().split(',')[1],
      'font-size': `${$('input[name="font-size"]:checked').val()}pt`,
    });
  });
};
