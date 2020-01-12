import 'x-frame-bypass';
// cannot print iframe url to addr bar due to cross-domain policy
export default (elements) => {
  const HOME = 'https://www.msn.com';
  const SEARCH = 'https://www.bing.com/search?q=';

  const ADDR = elements.address;
  const BING = elements.bing;
  const START = elements.start;
  const PAGE = elements.page;
  // const PREV = elements.prev;
  // const NEXT = elements.next;
  const { isEnter } = elements;

  function load(url) {
    ADDR.val(url);
    PAGE.html(`<iframe src="${url}" frameBorder=0 is="x-frame-bypass"></iframe>`);
  }

  START.click(() => {
    if (!PAGE.find('iframe')[0]) load(HOME);
  });
  ADDR
    .focus((e) => e.target.select())
    .keyup((e) => {
      if (isEnter(e)) load(e.target.value);
    });
  BING.keyup((e) => { if (isEnter(e)) load(SEARCH + e.target.value); });
};
