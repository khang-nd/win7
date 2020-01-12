/* eslint-disable func-names */
import $ from 'jquery';

export default (() => {
  /**
   * sorttable.js (modified)
   * jQuery plug-in that allows sorting table by column
   * https://www.jqueryscript.net/table/Simplest-jQuery-Sortable-Table-Plugin-sorttable-js.html
   */
  $.fn.addSortWidget = function () {
    const table = $(this);
    let isAscending = true;

    $('th', table).on('click', function () {
      const column = $(this);
      isAscending = !isAscending;

      $('th', table).attr('class', 'sortable');
      column
        .addClass('sorting')
        .addClass(isAscending ? 'asc' : 'des');

      // save rows to array for sorting
      const rows = $('tr', table).not(':first-child').get();
      rows
        // sort rows
        .sort((a, b) => {
          const index = column.index();
          const m = $(`td:eq(${index})`, a).text();
          const n = $(`td:eq(${index})`, b).text();
          return isAscending ? m.localeCompare(n) : n.localeCompare(m);
        })
        // append sorted rows
        .forEach((row) => $(table).append(row));
    });

    return table;
  };

  /**
   * Custom hold event
   */
  const taphold = {
    time: 750,
    setup() {
      $(this).bind('touchstart mousedown', taphold.time, (e) => {
        const $this = $(this);
        $this.data('taphold', setTimeout(() => {
          $this.trigger($.extend(e, $.Event('taphold')));
        }, e.data));
      });
      $(this).bind('touchend touchmove mouseup mousemove', () => {
        clearTimeout($(this).data('taphold'));
      });
    },
  };
  $.event.special.taphold = taphold;

  $.fn.flex = function () {
    return this.css('display', 'flex');
  };
})();
