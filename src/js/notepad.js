import $ from 'jquery';
import Device from './_device';
import { getDateTime } from './calendar';

export default (elements) => {
  const EDITOR = elements.editor;
  const NEW = elements.new;
  const OPEN = elements.open;
  // const SAVE = elements.save;
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
  OPEN.click(() => {
    $('<input>', { type: 'file' })
      .click()
      .change((e) => {
        const { files } = e.target;
        if (!files.length) return;
        if (files[0].size > 100 * 1024) {
          Device.showToast('File size is limited to 100 KB');
          return;
        }
        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = (ev) => EDITOR.val(ev.target.result);
      });
  });

  // edit
  UNDO.click(() => document.execCommand('undo'));
  ALL.click(() => EDITOR.select());
  DATETIME.click(() => {
    const {
      h, m, D, M, Y,
    } = getDateTime();
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
      CUT.removeClass('text-muted').on('click', () => document.execCommand('cut'));
      COPY.removeClass('text-muted').on('click', () => document.execCommand('copy'));
      DELETE.removeClass('text-muted').on('click', () => document.execCommand('delete'));
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
